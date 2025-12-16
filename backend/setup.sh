#!/bin/bash

# Setup script for KOL Analytics Backend
# This script creates a virtual environment and installs dependencies

echo "=================================="
echo " KOL Analytics Backend Setup"
echo "=================================="
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo " Error: Python 3 is not installed"
    echo "Please install Python 3.10 or higher"
    exit 1
fi

echo " Python 3 found: $(python3 --version)"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo " Creating virtual environment..."
    python3 -m venv venv
    echo " Virtual environment created"
else
    echo " Virtual environment already exists"
fi

echo ""

# Activate virtual environment
echo " Activating virtual environment..."
source venv/bin/activate

echo "✓ Virtual environment activated"
echo ""

# Upgrade pip
echo "⬆  Upgrading pip..."
pip install --upgrade pip --quiet

echo " pip upgraded"
echo ""

# Install dependencies
echo " Installing dependencies from requirements.txt..."
pip install -r requirements.txt --quiet

echo " Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo " Creating .env file from .env.example..."
    cp .env.example .env 2>/dev/null || echo "# Create your own .env file" > .env
    echo ".env file created (customize as needed)"
else
    echo ".env file already exists"
fi

echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "To start the backend server:"
echo "  1. Activate the virtual environment:"
echo "     source venv/bin/activate"
echo ""
echo "  2. Run the server:"
echo "     python run.py"
echo "     OR"
echo "     uvicorn app.main:app --reload"
echo ""
echo "  3. Access the API:"
echo "     http://localhost:8000/docs"
echo ""
echo "=================================="

