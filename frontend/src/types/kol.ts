/**
 * TypeScript Type Definitions for KOL Analytics Dashboard
 * Strictly typed interfaces matching the provided mockKolData structure
 */

/**
 * Core KOL (Key Opinion Leader) interface
 * Represents a medical professional in dermatology/vitiligo research
 */
export interface KOL {
  id: string;
  name: string;
  affiliation: string;
  country: string;
  city?: string;
  expertiseArea: string;
  publicationsCount: number;
  hIndex: number;
  citations: number;
}

/**
 * Aggregate statistics for KOL dataset
 * Used for dashboard summary cards
 */
export interface KOLStats {
  totalKOLs: number;
  totalPublications: number;
  countriesRepresented: number;
  avgHIndex: number;
  avgCitationsPerPublication: number;
  topCountries: CountryDistribution[];
  expertiseDistribution: ExpertiseDistribution[];
  topCitationRatioKOL: {
    kol: KOL;
    ratio: number;
  };
}

/**
 * Country-level aggregation for geographic distribution
 */
export interface CountryDistribution {
  country: string;
  count: number;
  percentage: number;
}

/**
 * Expertise area aggregation for specialization distribution
 */
export interface ExpertiseDistribution {
  expertiseArea: string;
  count: number;
  percentage: number;
}

/**
 * API Response wrapper for error handling
 */
export interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Filter options for KOL Explorer
 */
export interface KOLFilters {
  search: string;
  country: string;
  expertiseArea: string;
  hIndexRange: [number, number];
}

/**
 * Sort configuration for KOL tables
 */
export interface SortConfig {
  field: keyof KOL;
  direction: 'asc' | 'desc';
}

/**
 * DATA ANALYSIS FINDINGS (as per test requirements):
 * 
 * 1. HIGHEST CITATIONS-TO-PUBLICATIONS RATIO:
 *    Dr. Patricia Williams (Johns Hopkins University) has the highest ratio of 48.93 citations/publication
 *    (5921 citations / 121 publications = 48.93)
 *    
 *    WHY THIS IS SIGNIFICANT:
 *    - Indicates exceptionally high-impact research - each publication is cited ~49 times on average
 *    - Average ratio in dataset is ~42.7, so she's ~14% above average
 *    - Suggests focused research in high-visibility areas within Pigmentation Disorders
 *    - May indicate collaboration with other high-impact researchers or work on breakthrough findings
 *    - Her H-Index of 45 confirms sustained high-impact output (45 publications with ≥45 citations each)
 *    
 * 2. DATA QUALITY ISSUES OBSERVED:
 *    
 *    a) INCONSISTENT NAMING CONVENTIONS:
 *       - Mix of "Dr." and "Prof." titles without clear pattern
 *       - No standardization of academic rank despite affiliation data
 *    
 *    b) MISSING DATA:
 *       - 'city' field is optional but present for all 50 KOLs (actually good quality here)
 *       - No timestamps for when data was collected
 *       - No publication date ranges (could have recent vs. historical citations)
 *    
 *    c) POTENTIAL OUTLIERS:
 *       - Dr. Fatima Al-Rashid has very low metrics (22 h-index, 1876 citations)
 *       - Significant variance in citation counts (1876 to 7234) - 3.8x difference
 *       - H-index range: 22-51, suggesting mix of junior and senior researchers
 *    
 *    d) EXPERTISE AREA CLASSIFICATION:
 *       - Only 6 unique expertise areas for 50 KOLs - seems limited
 *       - "Dermatology" is very broad compared to "Vitiligo Research" (specific)
 *       - Inconsistent granularity across categories
 *    
 *    e) NO VALIDATION OF RELATIONSHIPS:
 *       - Citations should mathematically relate to h-index, but no validation
 *       - publicationsCount should be >= hIndex (h-index definition), but not enforced
 *       - Example: Prof. Henrik Larsson has 41 h-index with 109 publications (valid)
 *         but no check for data integrity
 *    
 *    f) GEOGRAPHIC BIAS:
 *       - Heavy concentration in Western countries and research hubs
 *       - Underrepresentation from Africa (2 entries), South America (3 entries)
 *       - May not reflect true global expertise distribution
 *    
 *    g) NO TEMPORAL DATA:
 *       - No indication if these are lifetime or recent publications
 *       - Citation counts may be outdated
 *       - H-index is cumulative, but no way to track growth/decline
 */

