"""
KOL Service - Business Logic Layer
Handles data loading, caching, and statistical calculations
"""

import json
from pathlib import Path
from typing import Optional
from collections import Counter

from app.models import (
    KOL,
    KOLStats,
    CountryDistribution,
    ExpertiseDistribution,
    TopCitationRatioKOL
)
from app.config import settings


class KOLService:
    """
    Service class for KOL data management
    Implements singleton pattern for data caching
    """
    
    _instance: Optional['KOLService'] = None
    _kols: list[KOL] = []
    _kols_by_id: dict[str, KOL] = {}
    
    def __new__(cls):
        """Singleton pattern to ensure only one instance with cached data"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_data()
        return cls._instance
    
    def _load_data(self) -> None:
        """
        Load KOL data from JSON file
        Implements error handling and data validation
        """
        try:
            data_path = Path(settings.json_data_path)
            
            if not data_path.exists():
                raise FileNotFoundError(f"Data file not found: {data_path}")
            
            with open(data_path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
            
            # Validate and convert to Pydantic models
            self._kols = [KOL(**item) for item in raw_data]
            
            # Create index for O(1) lookup by ID
            self._kols_by_id = {kol.id: kol for kol in self._kols}
            
            print(f"✓ Loaded {len(self._kols)} KOLs from {data_path.name}")
            
        except FileNotFoundError as e:
            print(f"✗ Error: {e}")
            raise
        except json.JSONDecodeError as e:
            print(f"✗ JSON parsing error: {e}")
            raise
        except Exception as e:
            print(f"✗ Unexpected error loading data: {e}")
            raise
    
    def get_all_kols(self) -> list[KOL]:
        """
        Retrieve all KOLs
        
        Returns:
            List of all KOL objects
        """
        return self._kols.copy()  # Return copy to prevent external modification
    
    def get_kol_by_id(self, kol_id: str) -> Optional[KOL]:
        """
        Retrieve a single KOL by ID
        
        Args:
            kol_id: Unique identifier for the KOL
            
        Returns:
            KOL object if found, None otherwise
        """
        return self._kols_by_id.get(kol_id)
    
    def calculate_statistics(self) -> KOLStats:
        """
        Calculate aggregate statistics for the entire KOL dataset
        
        This method performs the data analysis required by the test:
        - Identifies KOL with highest citation ratio
        - Calculates geographic and expertise distributions
        - Computes averages and totals
        
        Returns:
            KOLStats object with all calculated metrics
        """
        if not self._kols:
            raise ValueError("No KOL data available for statistics calculation")
        
        # Calculate basic totals
        total_kols = len(self._kols)
        total_publications = sum(kol.publicationsCount for kol in self._kols)
        total_citations = sum(kol.citations for kol in self._kols)
        
        # Calculate averages
        avg_h_index = sum(kol.hIndex for kol in self._kols) / total_kols
        avg_citations_per_pub = total_citations / total_publications if total_publications > 0 else 0
        
        # Country distribution
        country_counts = Counter(kol.country for kol in self._kols)
        countries_represented = len(country_counts)
        
        top_countries = [
            CountryDistribution(
                country=country,
                count=count,
                percentage=(count / total_kols) * 100
            )
            for country, count in country_counts.most_common(10)
        ]
        
        # Expertise distribution
        expertise_counts = Counter(kol.expertiseArea for kol in self._kols)
        expertise_distribution = [
            ExpertiseDistribution(
                expertiseArea=area,
                count=count,
                percentage=(count / total_kols) * 100
            )
            for area, count in sorted(
                expertise_counts.items(),
                key=lambda x: x[1],
                reverse=True
            )
        ]
        
        # Find KOL with highest citation-to-publication ratio
        # This directly addresses the data analysis requirement
        kol_with_ratios = [
            (kol, kol.citations / kol.publicationsCount if kol.publicationsCount > 0 else 0)
            for kol in self._kols
        ]
        
        top_kol, top_ratio = max(kol_with_ratios, key=lambda x: x[1])
        percentage_above_avg = ((top_ratio - avg_citations_per_pub) / avg_citations_per_pub) * 100
        
        top_citation_ratio_kol = TopCitationRatioKOL(
            kol=top_kol,
            ratio=round(top_ratio, 2),
            percentageAboveAverage=round(percentage_above_avg, 2)
        )
        
        return KOLStats(
            totalKOLs=total_kols,
            totalPublications=total_publications,
            countriesRepresented=countries_represented,
            avgHIndex=round(avg_h_index, 1),
            avgCitationsPerPublication=round(avg_citations_per_pub, 1),
            topCountries=top_countries,
            expertiseDistribution=expertise_distribution,
            topCitationRatioKOL=top_citation_ratio_kol
        )
    
    def search_kols(
        self,
        query: Optional[str] = None,
        country: Optional[str] = None,
        expertise_area: Optional[str] = None,
        min_h_index: Optional[int] = None,
        max_h_index: Optional[int] = None
    ) -> list[KOL]:
        """
        Search and filter KOLs based on criteria (Bonus feature)
        
        Args:
            query: Search term for name or affiliation
            country: Filter by country
            expertise_area: Filter by expertise area
            min_h_index: Minimum h-index
            max_h_index: Maximum h-index
            
        Returns:
            Filtered list of KOLs
        """
        results = self._kols
        
        if query:
            query_lower = query.lower()
            results = [
                kol for kol in results
                if query_lower in kol.name.lower() or query_lower in kol.affiliation.lower()
            ]
        
        if country:
            results = [kol for kol in results if kol.country == country]
        
        if expertise_area:
            results = [kol for kol in results if kol.expertiseArea == expertise_area]
        
        if min_h_index is not None:
            results = [kol for kol in results if kol.hIndex >= min_h_index]
        
        if max_h_index is not None:
            results = [kol for kol in results if kol.hIndex <= max_h_index]
        
        return results
    
    def get_unique_countries(self) -> list[str]:
        """Get sorted list of unique countries"""
        return sorted(set(kol.country for kol in self._kols))
    
    def get_unique_expertise_areas(self) -> list[str]:
        """Get sorted list of unique expertise areas"""
        return sorted(set(kol.expertiseArea for kol in self._kols))


# Global service instance
kol_service = KOLService()

