/* eslint-disable react-refresh/only-export-components */
/**
 * KOL Context API for Global State Management
 * Implements Context API + custom hooks as per test requirements
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { KOL, KOLStats, LoadingState } from "@/types/kol";
import {
  fetchKOLs,
  fetchKOLStats,
  calculateStatsFromKOLs,
  checkAPIHealth,
  fetchCountries,
  fetchExpertiseAreas,
} from "@/services/api";
import mockKolDataJSON from "../../../mockKolData.json";

/**
 * Context State Interface
 */
interface KOLContextState {
  kols: KOL[];
  stats: KOLStats | null;
  loading: LoadingState;
  refreshData: () => Promise<void>;
  isAPIAvailable: boolean;
  countries: string[];
  expertiseAreas: string[];
}

/**
 * Create the context with undefined default
 * This ensures we catch usage outside of Provider
 */
const KOLContext = createContext<KOLContextState | undefined>(undefined);

/**
 * Provider Props
 */
interface KOLProviderProps {
  children: ReactNode;
}

/**
 * KOL Context Provider Component
 * Manages global state for KOL data and statistics
 */
export function KOLProvider({ children }: KOLProviderProps) {
  const [kols, setKols] = useState<KOL[]>([]);
  const [stats, setStats] = useState<KOLStats | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [isAPIAvailable, setIsAPIAvailable] = useState<boolean>(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);

  /**
   * Load data from API or fallback to mock data
   */
  const loadData = useCallback(async () => {
    setLoading({ isLoading: true, error: null });

    try {
      // Check if API is available
      const apiHealthy = await checkAPIHealth();
      setIsAPIAvailable(apiHealthy);

      if (apiHealthy) {
        // Try to fetch from API - NOW USING ALL ENDPOINTS!
        const [
          kolsResponse,
          statsResponse,
          countriesResponse,
          expertiseResponse,
        ] = await Promise.all([
          fetchKOLs(),
          fetchKOLStats(),
          fetchCountries(),
          fetchExpertiseAreas(),
        ]);

        // Handle KOLs response
        if (kolsResponse.error) {
          throw new Error(kolsResponse.error);
        }

        if (kolsResponse.data) {
          setKols(kolsResponse.data);
        }

        // Handle Stats response - if not available, calculate client-side
        if (statsResponse.error || !statsResponse.data) {
          if (kolsResponse.data) {
            const calculatedStats = calculateStatsFromKOLs(kolsResponse.data);
            setStats(calculatedStats);
          }
        } else {
          setStats(statsResponse.data);
        }

        // Handle Countries response - use from API or extract from KOLs
        if (countriesResponse.data && countriesResponse.data.length > 0) {
          setCountries(countriesResponse.data);
        } else if (kolsResponse.data) {
          const uniqueCountries = Array.from(
            new Set(kolsResponse.data.map((kol) => kol.country))
          ).sort();
          setCountries(uniqueCountries);
        }

        // Handle Expertise Areas response - use from API or extract from KOLs
        if (expertiseResponse.data && expertiseResponse.data.length > 0) {
          setExpertiseAreas(expertiseResponse.data);
        } else if (kolsResponse.data) {
          const uniqueExpertise = Array.from(
            new Set(kolsResponse.data.map((kol) => kol.expertiseArea))
          ).sort();
          setExpertiseAreas(uniqueExpertise);
        }

        setLoading({ isLoading: false, error: null });
      } else {
        // Fallback to mock data when API is unavailable
        console.warn("Backend API not available. Using mock data.");

        // Type assertion needed because JSON import doesn't have full type info
        const mockKols = mockKolDataJSON as KOL[];
        setKols(mockKols);

        // Calculate stats from mock data
        const calculatedStats = calculateStatsFromKOLs(mockKols);
        setStats(calculatedStats);

        // Extract countries and expertise from mock data
        const uniqueCountries = Array.from(
          new Set(mockKols.map((kol) => kol.country))
        ).sort();
        setCountries(uniqueCountries);

        const uniqueExpertise = Array.from(
          new Set(mockKols.map((kol) => kol.expertiseArea))
        ).sort();
        setExpertiseAreas(uniqueExpertise);

        setLoading({ isLoading: false, error: null });
      }
    } catch (error) {
      // On error, fall back to mock data
      console.error("Error loading KOL data:", error);

      try {
        const mockKols = mockKolDataJSON as KOL[];
        setKols(mockKols);
        const calculatedStats = calculateStatsFromKOLs(mockKols);
        setStats(calculatedStats);

        // Extract countries and expertise from mock data
        const uniqueCountries = Array.from(
          new Set(mockKols.map((kol) => kol.country))
        ).sort();
        setCountries(uniqueCountries);

        const uniqueExpertise = Array.from(
          new Set(mockKols.map((kol) => kol.expertiseArea))
        ).sort();
        setExpertiseAreas(uniqueExpertise);

        setLoading({
          isLoading: false,
          error: "Using local data. Backend connection failed.",
        });
      } catch (fallbackError) {
        setLoading({
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load data",
        });
      }
    }
  }, []);

  /**
   * Refresh data on demand
   */
  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Initial data load on mount
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  const value: KOLContextState = {
    kols,
    stats,
    loading,
    refreshData,
    isAPIAvailable,
    countries,
    expertiseAreas,
  };

  return <KOLContext.Provider value={value}>{children}</KOLContext.Provider>;
}

/**
 * Custom hook to use KOL Context
 * Throws error if used outside of Provider (type-safe)
 */
export function useKOL(): KOLContextState {
  const context = useContext(KOLContext);

  if (context === undefined) {
    throw new Error("useKOL must be used within a KOLProvider");
  }

  return context;
}

/**
 * Custom hook for filtered KOLs
 * Provides client-side filtering capabilities
 */
export function useFilteredKOLs(filters: {
  search?: string;
  country?: string;
  expertiseArea?: string;
  hIndexMin?: number;
  hIndexMax?: number;
}) {
  const { kols } = useKOL();

  return kols.filter((kol) => {
    // Search filter (name or affiliation)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        kol.name.toLowerCase().includes(searchLower) ||
        kol.affiliation.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Country filter
    if (
      filters.country &&
      filters.country !== "all" &&
      kol.country !== filters.country
    ) {
      return false;
    }

    // Expertise area filter
    if (
      filters.expertiseArea &&
      filters.expertiseArea !== "all" &&
      kol.expertiseArea !== filters.expertiseArea
    ) {
      return false;
    }

    // H-Index range filter
    if (filters.hIndexMin !== undefined && kol.hIndex < filters.hIndexMin) {
      return false;
    }
    if (filters.hIndexMax !== undefined && kol.hIndex > filters.hIndexMax) {
      return false;
    }

    return true;
  });
}

/**
 * Custom hook to get unique values for filters
 * NOW USES DATA FROM BACKEND META ENDPOINTS!
 */
export function useKOLFilterOptions() {
  const { countries, expertiseAreas } = useKOL();

  return {
    countries,
    expertiseAreas,
  };
}
