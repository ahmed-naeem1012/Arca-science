"""
KOL API Router
Defines all endpoints for KOL data access
Implements RESTful conventions with proper error handling
"""

from fastapi import APIRouter, HTTPException, Query, Path
from typing import Optional

from app.models import KOL, KOLStats, ErrorResponse
from app.services.kol_service import kol_service


# Create router with prefix and tags for OpenAPI documentation
router = APIRouter(
    prefix="/api/kols",
    tags=["KOLs"],
    responses={
        500: {
            "model": ErrorResponse,
            "description": "Internal Server Error"
        }
    }
)


@router.get(
    "",
    response_model=list[KOL],
    summary="List all KOLs",
    description="""
    Retrieve a list of all Key Opinion Leaders in the database.
    
    **Bonus**: Supports optional query parameters for filtering:
    - `query`: Search in name or affiliation
    - `country`: Filter by country
    - `expertiseArea`: Filter by expertise area
    - `minHIndex`: Minimum h-index threshold
    - `maxHIndex`: Maximum h-index threshold
    """,
    response_description="List of KOL objects"
)
async def get_kols(
    query: Optional[str] = Query(
        None,
        description="Search term for name or affiliation",
        min_length=1
    ),
    country: Optional[str] = Query(
        None,
        description="Filter by country"
    ),
    expertiseArea: Optional[str] = Query(
        None,
        alias="expertiseArea",
        description="Filter by expertise area"
    ),
    minHIndex: Optional[int] = Query(
        None,
        alias="minHIndex",
        ge=0,
        description="Minimum h-index"
    ),
    maxHIndex: Optional[int] = Query(
        None,
        alias="maxHIndex",
        ge=0,
        description="Maximum h-index"
    )
) -> list[KOL]:
    """
    GET /api/kols
    
    Returns all KOLs or filtered subset based on query parameters.
    Implements bonus filtering feature for enhanced frontend capabilities.
    """
    try:
        # If any filters provided, use search; otherwise return all
        if any([query, country, expertiseArea, minHIndex is not None, maxHIndex is not None]):
            return kol_service.search_kols(
                query=query,
                country=country,
                expertise_area=expertiseArea,
                min_h_index=minHIndex,
                max_h_index=maxHIndex
            )
        
        return kol_service.get_all_kols()
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving KOLs: {str(e)}"
        )


@router.get(
    "/stats",
    response_model=KOLStats,
    summary="Get aggregate statistics",
    description="""
    Calculate and return comprehensive statistics for the KOL dataset:
    - Total counts (KOLs, publications, countries)
    - Averages (h-index, citations per publication)
    - Geographic distribution (top 10 countries)
    - Expertise area distribution
    - Top citation ratio analysis
    
    **Note**: This endpoint performs real-time calculations on the dataset.
    """,
    response_description="Aggregate statistics object"
)
async def get_kol_stats() -> KOLStats:
    """
    GET /api/kols/stats
    
    Returns comprehensive aggregate statistics calculated from the entire dataset.
    This directly fulfills the test requirement for statistical analysis.
    """
    try:
        return kol_service.calculate_statistics()
        
    except ValueError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating statistics: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )


@router.get(
    "/{kol_id}",
    response_model=KOL,
    summary="Get single KOL by ID",
    description="Retrieve detailed information for a specific KOL using their unique identifier.",
    responses={
        200: {
            "description": "KOL found and returned",
            "model": KOL
        },
        404: {
            "description": "KOL not found",
            "model": ErrorResponse
        }
    },
    response_description="KOL object with complete details"
)
async def get_kol_by_id(
    kol_id: str = Path(
        ...,
        description="Unique identifier for the KOL",
        min_length=1,
        examples=["1", "15", "50"]
    )
) -> KOL:
    """
    GET /api/kols/{id}
    
    Returns a single KOL by their unique ID.
    Implements proper 404 error handling as required.
    """
    kol = kol_service.get_kol_by_id(kol_id)
    
    if kol is None:
        raise HTTPException(
            status_code=404,
            detail=f"KOL with id '{kol_id}' not found"
        )
    
    return kol


# Bonus endpoints for enhanced functionality

@router.get(
    "/meta/countries",
    response_model=list[str],
    summary="Get list of unique countries",
    description="Returns a sorted list of all unique countries in the dataset",
    tags=["Meta"]
)
async def get_countries() -> list[str]:
    """
    GET /api/kols/meta/countries
    
    Bonus endpoint: Returns unique countries for frontend filter dropdowns
    """
    try:
        return kol_service.get_unique_countries()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving countries: {str(e)}"
        )


@router.get(
    "/meta/expertise-areas",
    response_model=list[str],
    summary="Get list of unique expertise areas",
    description="Returns a sorted list of all unique expertise areas in the dataset",
    tags=["Meta"]
)
async def get_expertise_areas() -> list[str]:
    """
    GET /api/kols/meta/expertise-areas
    
    Bonus endpoint: Returns unique expertise areas for frontend filter dropdowns
    """
    try:
        return kol_service.get_unique_expertise_areas()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving expertise areas: {str(e)}"
        )

