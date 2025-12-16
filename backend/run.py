#!/usr/bin/env python3
"""
Simple run script for the KOL Analytics API
Usage: python run.py
"""

import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"\n{'='*60}")
    print(f"🚀 Starting {settings.app_name}")
    print(f"{'='*60}\n")
    print(f"📍 Server will run on: http://{settings.host}:{settings.port}")
    print(f"📚 API Documentation: http://localhost:{settings.port}/docs")
    print(f"💚 Health Check: http://localhost:{settings.port}/health")
    print(f"\n{'='*60}\n")
    print("Press CTRL+C to stop the server\n")
    
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )

