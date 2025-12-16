# KOL Analytics Backend API

FastAPI-based REST API for Key Opinion Leader (KOL) analytics dashboard.

## Test Requirements Compliance

This backend fully implements all technical test requirements:

- **Serves KOL data** from `mockKolData.json`
- **Three RESTful endpoints**: `/api/kols`, `/api/kols/{id}`, `/api/kols/stats`
- **Pydantic models** for request/response validation
- **Error handling** (404 for not found, 500 for server errors)
- **CORS configuration** for frontend integration
- **Data analysis** (citation ratios, distributions)
- **Bonus features**: Advanced filtering, meta endpoints

## Project Structure

```
backend/
├── app/
│   ├── __init__.py           # Package initialization
│   ├── main.py               # FastAPI application & startup
│   ├── config.py             # Configuration management
│   ├── models.py             # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   └── kol_service.py    # Business logic & data loading
│   └── routers/
│       ├── __init__.py
│       └── kol_router.py     # API endpoints
├── requirements.txt          # Python dependencies
├── .env.example              # Environment configuration template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## Quick Start

### Prerequisites

- Python 3.10+ 
- pip or virtualenv

### Installation

1. **Create virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate virtual environment**:
   ```bash
   # macOS/Linux
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment** (optional):
   ```bash
   cp .env.example .env
   # Edit .env if needed
   ```

5. **Run the server**:
   ```bash
   # From backend directory
   uvicorn app.main:app --reload
   
   # Or using Python directly
   python -m app.main
   ```

6. **Access the API**:
   - API: http://localhost:8000
   - Interactive Docs (Swagger): http://localhost:8000/docs
   - Alternative Docs (ReDoc): http://localhost:8000/redoc
   - Health Check: http://localhost:8000/health

## 📡 API Endpoints

### Core Endpoints (Required)

#### 1. List KOLs
```http
GET /api/kols
```
Returns all KOLs in the database.

**Optional Query Parameters** (Bonus):
- `query` - Search in name/affiliation
- `country` - Filter by country
- `expertiseArea` - Filter by expertise
- `minHIndex` - Minimum h-index
- `maxHIndex` - Maximum h-index

**Response**: `200 OK`
```json
[
  {
    "id": "1",
    "name": "Dr. Sarah Johnson",
    "affiliation": "Harvard Medical School",
    "country": "United States",
    "city": "Boston",
    "expertiseArea": "Dermatology",
    "publicationsCount": 127,
    "hIndex": 42,
    "citations": 5432
  },
  ...
]
```

#### 2. Get Single KOL
```http
GET /api/kols/{id}
```
Returns a specific KOL by ID.

**Response**: `200 OK` or `404 Not Found`
```json
{
  "id": "15",
  "name": "Dr. Patricia Williams",
  "affiliation": "Johns Hopkins University",
  "country": "United States",
  "expertiseArea": "Pigmentation Disorders",
  "publicationsCount": 121,
  "hIndex": 45,
  "citations": 5921
}
```

**Error Response**: `404`
```json
{
  "error": "KOL with id '999' not found",
  "status_code": 404
}
```

#### 3. Get Statistics
```http
GET /api/kols/stats
```
Returns aggregate statistics for the entire dataset.

**Response**: `200 OK`
```json
{
  "totalKOLs": 50,
  "totalPublications": 4532,
  "countriesRepresented": 30,
  "avgHIndex": 35.5,
  "avgCitationsPerPublication": 42.7,
  "topCountries": [
    {
      "country": "United States",
      "count": 8,
      "percentage": 16.0
    }
  ],
  "expertiseDistribution": [
    {
      "expertiseArea": "Dermatology",
      "count": 15,
      "percentage": 30.0
    }
  ],
  "topCitationRatioKOL": {
    "kol": { ... },
    "ratio": 48.93,
    "percentageAboveAverage": 14.5
  }
}
```

### System Endpoints

#### Health Check
```http
GET /health
```
Returns API health status.

**Response**: `200 OK`
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "data_source": "json",
  "total_kols": 50
}
```

### Bonus Endpoints

#### Get Countries List
```http
GET /api/kols/meta/countries
```
Returns unique countries for filter dropdowns.

#### Get Expertise Areas List
```http
GET /api/kols/meta/expertise-areas
```
Returns unique expertise areas for filter dropdowns.

## Architecture Decisions

### 1. Layered Architecture
- **Router Layer** (`routers/`): HTTP endpoint definitions
- **Service Layer** (`services/`): Business logic & data management
- **Model Layer** (`models.py`): Data validation & serialization

**Rationale**: Clean separation of concerns, testability, maintainability

### 2. Singleton Service Pattern
`KOLService` uses singleton pattern to cache loaded data in memory.

**Benefits**:
- Fast O(1) lookups by ID
- Data loaded once at startup
- Consistent state across requests

**Tradeoff**: Not suitable for large datasets (>10K records)

### 3. Pydantic Validation
All data passes through Pydantic models for type safety.

**Features**:
- Automatic type conversion
- Field validation (min/max, length)
- Custom validators (e.g., publicationsCount >= hIndex)
- OpenAPI schema generation

### 4. Error Handling Strategy
Three-tier error handling:
1. **HTTP Exceptions** (404, 422) - Client errors
2. **Service Exceptions** - Business logic errors
3. **Global Handler** - Unexpected errors (500)

All errors return consistent JSON format.

## Data Analysis (Test Requirement)

### Highest Citation Ratio KOL

**Finding**: **Dr. Patricia Williams** (Johns Hopkins University)
- **Ratio**: 48.93 citations per publication (5921 ÷ 121)
- **Significance**: 14.5% above dataset average
- **Why it matters**: 
  - Indicates exceptional research impact
  - Each publication highly cited suggests breakthrough work
  - Strong indicator of thought leadership in Pigmentation Disorders

**Implementation**: Calculated in `kol_service.calculate_statistics()`

### Data Quality Issues

Documented in `/frontend/src/types/kol.ts` (comprehensive analysis):
1. **Inconsistent naming** (Dr. vs Prof. titles)
2. **Missing temporal data** (no timestamps)
3. **Geographic bias** (Western country concentration)
4. **Expertise granularity inconsistency**
5. **No data validation rules** enforced in source

**Backend Validation**: Pydantic models enforce:
- `publicationsCount >= hIndex` (h-index definition)
- Non-negative values for counts
- Required fields present

## Configuration

Edit `.env` file or set environment variables:

```bash
# Change port
PORT=8080

# Add CORS origin
CORS_ORIGINS=http://localhost:5173,https://myapp.com

# Switch to Excel data (bonus)
DATA_SOURCE=excel
```

## Testing the API

### Using Swagger UI (Recommended)
1. Navigate to http://localhost:8000/docs
2. Click "Try it out" on any endpoint
3. Execute and see live responses

### Using curl
```bash
# List all KOLs
curl http://localhost:8000/api/kols

# Get single KOL
curl http://localhost:8000/api/kols/15

# Get statistics
curl http://localhost:8000/api/kols/stats

# Search with filters (bonus)
curl "http://localhost:8000/api/kols?country=United%20States&minHIndex=40"
```

### Using Python requests
```python
import requests

# Get all KOLs
response = requests.get("http://localhost:8000/api/kols")
kols = response.json()

# Get statistics
response = requests.get("http://localhost:8000/api/kols/stats")
stats = response.json()
```

## Frontend Integration

The frontend is pre-configured to connect to this API. Ensure:

1. **Backend running** on `http://localhost:8000`
2. **CORS enabled** for frontend origin (default: `http://localhost:5173`)
3. **Health check passes**: Visit `/health` to verify

The frontend will:
- Automatically detect API availability
- Fall back to mock data if API unavailable
- Show connection status in UI

## 📊 Performance Considerations

Current implementation is optimized for the test dataset (~50 KOLs):

- **Startup**: Data loaded once, O(n) initial load
- **Get all KOLs**: O(1) - returns cached list
- **Get by ID**: O(1) - dictionary lookup
- **Statistics**: O(n) - calculated on-demand
- **Search/Filter**: O(n) - linear scan

### Scaling Recommendations

For production with >10K KOLs:
- Add database (PostgreSQL + SQLAlchemy)
- Implement pagination
- Cache statistics calculation
- Add database indexes
- Consider Redis for caching

## API Design Principles

Following RESTful conventions and test requirements:

1. **Resource-based URLs**: `/api/kols` (not `/getKOLs`)
2. **HTTP methods**: GET for retrieval
3. **Status codes**: 200 (success), 404 (not found), 422 (validation), 500 (error)
4. **Response format**: Always JSON
5. **Error consistency**: Uniform error response structure
6. **Documentation**: OpenAPI/Swagger auto-generated

## Bonus Features Implemented

- **Advanced filtering**: Query params for search & filter
- **Meta endpoints**: Countries & expertise lists for dropdowns
- **Comprehensive docs**: Swagger UI with examples
- **Health check**: For monitoring & frontend detection
- **Input validation**: Pydantic models with custom validators
- **Error details**: Helpful error messages for debugging

## Dependencies

- **FastAPI**: Modern, fast web framework
- **Uvicorn**: ASGI server with auto-reload
- **Pydantic**: Data validation & settings
- **python-dotenv**: Environment variable management
- **openpyxl/pandas**: Excel parsing (bonus)

## 👨‍💻 Development

```bash
# Run with auto-reload
uvicorn app.main:app --reload --log-level debug

# Run tests (if tests added)
pytest

# Format code
black app/

# Type checking
mypy app/
```

