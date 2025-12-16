"""
Configuration settings for the KOL Analytics API
Manages environment variables and application settings
"""

from pydantic_settings import BaseSettings
from pathlib import Path
import os


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # API Configuration
    app_name: str = "KOL Analytics API"
    app_version: str = "1.0.0"
    debug: bool = True
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    
    # CORS Configuration - Allow frontend origin
    cors_origins: list[str] = [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # Alternative React port
        "http://localhost:8080",  
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
    ]
    
    # Data Configuration
    data_source: str = "json"  # "json" or "excel"
    json_data_path: str = str(Path(__file__).parent.parent.parent / "mockKolData.json")
    excel_data_path: str = str(Path(__file__).parent.parent.parent / "Vitiligo_kol_csv_29_07_2024_drug_and_kol_standardized.xlsx")
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()

