/**
 * API Service Layer for KOL Analytics Dashboard
 * Handles all communication with the FastAPI backend
 * Includes proper error handling and type safety
 */

import { KOL, KOLStats, APIResponse } from '@/types/kol';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_PREFIX = '/api';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new APIError(
        errorText || response.statusText,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    // Network errors or JSON parse errors
    if (error instanceof APIError) {
      return {
        error: error.message,
        status: error.status,
      };
    }
    
    // Generic network error
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
      status: 0,
    };
  }
}

/**
 * Fetch all KOLs from the backend
 * Endpoint: GET /api/kols
 */
export async function fetchKOLs(): Promise<APIResponse<KOL[]>> {
  return apiFetch<KOL[]>('/kols');
}

/**
 * Fetch a single KOL by ID
 * Endpoint: GET /api/kols/{id}
 */
export async function fetchKOLById(id: string): Promise<APIResponse<KOL>> {
  return apiFetch<KOL>(`/kols/${id}`);
}

/**
 * Fetch aggregate statistics
 * Endpoint: GET /api/kols/stats
 */
export async function fetchKOLStats(): Promise<APIResponse<KOLStats>> {
  return apiFetch<KOLStats>('/kols/stats');
}

/**
 * Client-side calculation utilities for when backend is unavailable
 * These calculate stats from the KOL array directly
 */
export function calculateStatsFromKOLs(kols: KOL[]): KOLStats {
  // Calculate country distribution
  const countryMap = new Map<string, number>();
  kols.forEach(kol => {
    countryMap.set(kol.country, (countryMap.get(kol.country) || 0) + 1);
  });
  
  const topCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({
      country,
      count,
      percentage: (count / kols.length) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Calculate expertise distribution
  const expertiseMap = new Map<string, number>();
  kols.forEach(kol => {
    expertiseMap.set(kol.expertiseArea, (expertiseMap.get(kol.expertiseArea) || 0) + 1);
  });
  
  const expertiseDistribution = Array.from(expertiseMap.entries())
    .map(([expertiseArea, count]) => ({
      expertiseArea,
      count,
      percentage: (count / kols.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  // Find KOL with highest citation-to-publication ratio
  const kolsWithRatio = kols.map(kol => ({
    kol,
    ratio: kol.citations / kol.publicationsCount,
  }));
  
  const topCitationRatioKOL = kolsWithRatio.reduce((max, current) => 
    current.ratio > max.ratio ? current : max
  );

  // Calculate totals and averages
  const totalPublications = kols.reduce((sum, kol) => sum + kol.publicationsCount, 0);
  const totalCitations = kols.reduce((sum, kol) => sum + kol.citations, 0);
  const avgHIndex = kols.reduce((sum, kol) => sum + kol.hIndex, 0) / kols.length;

  return {
    totalKOLs: kols.length,
    totalPublications,
    countriesRepresented: countryMap.size,
    avgHIndex: parseFloat(avgHIndex.toFixed(1)),
    avgCitationsPerPublication: parseFloat((totalCitations / totalPublications).toFixed(1)),
    topCountries,
    expertiseDistribution,
    topCitationRatioKOL,
  };
}

/**
 * Health check for the API
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch unique countries list from backend (Bonus endpoint)
 * Endpoint: GET /api/kols/meta/countries
 */
export async function fetchCountries(): Promise<APIResponse<string[]>> {
  return apiFetch<string[]>('/kols/meta/countries');
}

/**
 * Fetch unique expertise areas list from backend (Bonus endpoint)
 * Endpoint: GET /api/kols/meta/expertise-areas
 */
export async function fetchExpertiseAreas(): Promise<APIResponse<string[]>> {
  return apiFetch<string[]>('/kols/meta/expertise-areas');
}

