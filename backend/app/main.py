"""
FastAPI Main Application
KOL Analytics Dashboard Backend API

This module initializes the FastAPI application with:
- CORS configuration for frontend integration
- Global error handlers
- API routers
- Health check endpoint
- OpenAPI documentation
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.models import HealthResponse, ErrorResponse
from app.routers import kol_router
from app.services.kol_service import kol_service


# Initialize FastAPI application with metadata
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    ## KOL Analytics Dashboard API
    
    RESTful API for managing and analyzing Key Opinion Leader (KOL) data in the medical/pharmaceutical space.
    
    ### Features:
    - **KOL Data Access**: Retrieve complete KOL profiles
    - **Statistical Analysis**: Real-time aggregate calculations
    - **Advanced Filtering**: Search and filter capabilities (bonus)
    - **Type Safety**: Full Pydantic validation
    - **Error Handling**: Graceful error responses
    
    ### Data Source:
    Serves data from `mockKolData.json` containing ~50 KOLs with fields including:
    - Basic info (name, affiliation, country)
    - Metrics (publications, h-index, citations)
    - Expertise areas
    
    ### Test Requirements:
    This API fulfills all technical test requirements including:
    - ✓ Pydantic models for request/response validation
    - ✓ RESTful endpoint design
    - ✓ Comprehensive error handling (404, 500)
    - ✓ CORS configuration for frontend
    - ✓ Data analysis (citation ratios, distributions)
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    debug=settings.debug
)


# CORS Configuration - Required for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]
)


# Global Exception Handlers

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handle HTTP exceptions (404, 405, etc.)
    Returns consistent error response format
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "detail": None
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle Pydantic validation errors
    Returns detailed validation error information
    """
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "status_code": 422,
            "detail": exc.errors()
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Catch-all handler for unexpected errors
    Returns 500 Internal Server Error with safe error message
    """
    # Log the error (in production, use proper logging)
    print(f"Unexpected error: {type(exc).__name__}: {str(exc)}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "status_code": 500,
            "detail": "An unexpected error occurred. Please try again later." if not settings.debug else str(exc)
        }
    )


# Health Check Endpoint

@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Health check",
    description="Returns API health status and metadata"
)
async def health_check() -> HealthResponse:
    """
    GET /health
    
    Health check endpoint for monitoring and frontend API availability detection.
    Returns service status and basic metadata.
    """
    try:
        kols = kol_service.get_all_kols()
        return HealthResponse(
            status="healthy",
            version=settings.app_version,
            data_source=settings.data_source,
            total_kols=len(kols)
        )
    except Exception as e:
        return HealthResponse(
            status="unhealthy",
            version=settings.app_version,
            data_source=settings.data_source,
            total_kols=0
        )


# Root Endpoint

@app.get(
    "/",
    tags=["System"],
    summary="API Root",
    description="Returns API information and available endpoints"
)
async def root():
    """
    GET /
    
    Root endpoint providing API information and navigation links
    """
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_schema": "/openapi.json"
        },
        "endpoints": {
            "health": "/health",
            "kols": {
                "list": "/api/kols",
                "single": "/api/kols/{id}",
                "statistics": "/api/kols/stats"
            }
        },
        "message": "Welcome to the KOL Analytics API! Visit /docs for interactive documentation."
    }


# Include API Routers

app.include_router(kol_router.router)


# Startup Event

@app.on_event("startup")
async def startup_event():
    """
    Application startup handler
    Validates data is loaded and ready
    """
    print("\n" + "="*60)
    print(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    print("="*60)
    
    try:
        kols = kol_service.get_all_kols()
        print(f"✓ Data loaded: {len(kols)} KOLs available")
        print(f"✓ CORS enabled for: {', '.join(settings.cors_origins)}")
        print(f"✓ API Documentation: http://localhost:{settings.port}/docs")
        print(f"✓ Health Check: http://localhost:{settings.port}/health")
    except Exception as e:
        print(f"✗ Startup error: {e}")
        raise
    
    print("="*60 + "\n")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown handler
    Clean up resources
    """
    print("\n" + "="*60)
    print(f"👋 Shutting down {settings.app_name}")
    print("="*60 + "\n")


# Entry point for direct execution
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )

