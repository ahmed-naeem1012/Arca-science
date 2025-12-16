"""
Pydantic Models for KOL Analytics API
Provides request/response validation and serialization
"""

from pydantic import BaseModel, Field, validator
from typing import Optional


class KOL(BaseModel):
    """
    Key Opinion Leader model matching the mockKolData.json schema
    All fields use Pydantic validation for type safety
    """
    id: str = Field(..., description="Unique identifier for the KOL")
    name: str = Field(..., min_length=1, description="Full name of the KOL")
    affiliation: str = Field(..., description="Academic or institutional affiliation")
    country: str = Field(..., min_length=1, description="Country of residence")
    city: Optional[str] = Field(None, description="City of residence")
    expertiseArea: str = Field(..., alias="expertiseArea", description="Primary area of expertise")
    publicationsCount: int = Field(..., ge=0, alias="publicationsCount", description="Total number of publications")
    hIndex: int = Field(..., ge=0, alias="hIndex", description="H-index score")
    citations: int = Field(..., ge=0, description="Total citation count")
    
    class Config:
        populate_by_name = True  # Allow both snake_case and camelCase
        json_schema_extra = {
            "example": {
                "id": "1",
                "name": "Dr. Sarah Johnson",
                "affiliation": "Harvard Medical School",
                "country": "United States",
                "city": "Boston",
                "expertiseArea": "Dermatology",
                "publicationsCount": 127,
                "hIndex": 42,
                "citations": 5432
            }
        }
    
    @validator('publicationsCount')
    def validate_publications_vs_hindex(cls, v, values):
        """
        H-index definition: A researcher has index h if h of their publications 
        have at least h citations each. Therefore, publicationsCount >= hIndex
        """
        if 'hIndex' in values and v < values['hIndex']:
            raise ValueError(f'publicationsCount ({v}) must be >= hIndex ({values["hIndex"]})')
        return v


class CountryDistribution(BaseModel):
    """Geographic distribution statistics"""
    country: str
    count: int = Field(..., ge=0)
    percentage: float = Field(..., ge=0, le=100)


class ExpertiseDistribution(BaseModel):
    """Expertise area distribution statistics"""
    expertiseArea: str = Field(..., alias="expertiseArea")
    count: int = Field(..., ge=0)
    percentage: float = Field(..., ge=0, le=100)
    
    class Config:
        populate_by_name = True


class TopCitationRatioKOL(BaseModel):
    """KOL with highest citation-to-publication ratio"""
    kol: KOL
    ratio: float = Field(..., ge=0, description="Citations per publication")
    percentageAboveAverage: float = Field(..., alias="percentageAboveAverage")
    
    class Config:
        populate_by_name = True


class KOLStats(BaseModel):
    """
    Aggregate statistics for the KOL dataset
    Calculated dynamically from the data
    """
    totalKOLs: int = Field(..., ge=0, alias="totalKOLs")
    totalPublications: int = Field(..., ge=0, alias="totalPublications")
    countriesRepresented: int = Field(..., ge=0, alias="countriesRepresented")
    avgHIndex: float = Field(..., ge=0, alias="avgHIndex")
    avgCitationsPerPublication: float = Field(..., ge=0, alias="avgCitationsPerPublication")
    topCountries: list[CountryDistribution] = Field(..., max_length=10)
    expertiseDistribution: list[ExpertiseDistribution] = Field(..., alias="expertiseDistribution")
    topCitationRatioKOL: TopCitationRatioKOL = Field(..., alias="topCitationRatioKOL")
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "totalKOLs": 50,
                "totalPublications": 4500,
                "countriesRepresented": 30,
                "avgHIndex": 35.5,
                "avgCitationsPerPublication": 42.7,
                "topCountries": [
                    {"country": "United States", "count": 8, "percentage": 16.0}
                ],
                "expertiseDistribution": [
                    {"expertiseArea": "Dermatology", "count": 15, "percentage": 30.0}
                ],
                "topCitationRatioKOL": {
                    "kol": {
                        "id": "15",
                        "name": "Dr. Patricia Williams",
                        "affiliation": "Johns Hopkins University",
                        "country": "United States",
                        "expertiseArea": "Pigmentation Disorders",
                        "publicationsCount": 121,
                        "hIndex": 45,
                        "citations": 5921
                    },
                    "ratio": 48.93,
                    "percentageAboveAverage": 14.5
                }
            }
        }


class ErrorResponse(BaseModel):
    """Standard error response format"""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    status_code: int = Field(..., ge=400, le=599)
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Not Found",
                "detail": "KOL with id '999' not found",
                "status_code": 404
            }
        }


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(default="healthy")
    version: str
    data_source: str
    total_kols: int = Field(..., ge=0)

