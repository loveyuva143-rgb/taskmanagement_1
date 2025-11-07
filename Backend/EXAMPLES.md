# API Examples & Outputs

## 📋 Table of Contents
1. [Project Health Prediction Example](#project-health-prediction-example)
2. [Workload Analysis Example](#workload-analysis-example)
3. [Project Structure](#project-structure)

---

## 🔮 Project Health Prediction Example

### How It Works
The AI uses a **Random Forest Classifier** trained on historical project data to predict health status based on:
- Tasks completed
- Hours worked  
- Bugs reported

### Example Request

**Endpoint:** `POST /api/health`

**Request Body:**
```json
{
  "tasks": 60,
  "hours": 38,
  "bugs": 2
}
```

### Example Response

```json
{
  "predicted_health": "Excellent",
  "confidence_score": 0.85
}
```

### Understanding the Results

| Health Status | Meaning | Typical Metrics |
|--------------|---------|----------------|
| **Excellent** | High task completion, reasonable hours, low bugs | High tasks, ~40hrs, <3 bugs |
| **Good** | Good task completion, moderate hours, few bugs | Medium tasks, ~40-45hrs, 3-5 bugs |
| **Fair** | Average performance metrics | Medium tasks, ~45-50hrs, 5-7 bugs |
| **Poor** | Low task completion, high hours, many bugs | Low tasks, >50hrs, >7 bugs |

### More Examples

**Example 1: Excellent Health**
```json
Request:
{
  "tasks": 70,
  "hours": 40,
  "bugs": 1
}

Response:
{
  "predicted_health": "Excellent",
  "confidence_score": 0.92
}
```

**Example 2: Good Health**
```json
Request:
{
  "tasks": 45,
  "hours": 42,
  "bugs": 4
}

Response:
{
  "predicted_health": "Good",
  "confidence_score": 0.78
}
```

**Example 3: Poor Health**
```json
Request:
{
  "tasks": 30,
  "hours": 55,
  "bugs": 9
}

Response:
{
  "predicted_health": "Poor",
  "confidence_score": 0.81
}
```

---

## 📊 Workload Analysis Example

### How It Works
The AI uses **Isolation Forest** (an anomaly detection algorithm) to identify developers who may be overloaded by analyzing patterns in:
- Hours worked
- Tasks completed
- Bugs reported

### Example Request

**Endpoint:** `GET /api/workload`

No request body needed - it analyzes all developers in the database.

### Example Response

```json
[
  {
    "developer": "Alice Smith",
    "hours_worked": 38.0,
    "tasks_completed": 60,
    "bugs_reported": 2,
    "status": "Normal",
    "load_percentage": 95.0
  },
  {
    "developer": "Bob Johnson",
    "hours_worked": 45.0,
    "tasks_completed": 45,
    "bugs_reported": 4,
    "status": "Normal",
    "load_percentage": 112.5
  },
  {
    "developer": "Charlie Brown",
    "hours_worked": 40.0,
    "tasks_completed": 70,
    "bugs_reported": 1,
    "status": "Normal",
    "load_percentage": 100.0
  },
  {
    "developer": "Diana Prince",
    "hours_worked": 55.0,
    "tasks_completed": 30,
    "bugs_reported": 9,
    "status": "Overloaded",
    "load_percentage": 137.5
  }
]
```

### Understanding the Results

- **Status**: Either "Normal" or "Overloaded"
  - "Normal" means the developer's workload is within acceptable range
  - "Overloaded" means the AI detected anomalies (unusual patterns) suggesting overload

- **Load Percentage**: Calculated as `(hours_worked / 40) * 100`
  - < 100%: Under capacity
  - 100-120%: Normal range
  - > 120%: Potentially overloaded

- **Isolation Forest**: The algorithm learns what "normal" looks like from all developers, then flags those who deviate significantly (outliers).

### Real-World Interpretation

**Diana Prince** is flagged as "Overloaded" because:
- Works 55 hours (137.5% of 40-hour baseline)
- Only completed 30 tasks (low productivity despite high hours)
- Has 9 bugs (high error rate)

This combination suggests:
- Potential burnout
- Need for support or task reassignment
- Quality issues due to overwork

---

## 📁 Project Structure

```
Backend/
│
├── 📄 main.py                    # FastAPI app entry point
├── 📄 requirements.txt           # Python dependencies
├── 📄 init_db.py                 # Database initialization script
├── 📄 README.md                  # Complete documentation
├── 📄 EXAMPLES.md                # This file - examples and outputs
│
├── 📁 app/
│   ├── __init__.py
│   │
│   ├── 📄 config.py              # Configuration & environment settings
│   ├── 📄 database.py             # SQLAlchemy database setup
│   ├── 📄 models.py               # Database models (Users, Projects, Tasks, Metrics)
│   ├── 📄 schemas.py              # Pydantic validation schemas
│   │
│   ├── 📁 routers/                # API route handlers (organized by resource)
│   │   ├── __init__.py
│   │   ├── 📄 users.py            # User CRUD endpoints
│   │   ├── 📄 projects.py         # Project CRUD endpoints
│   │   ├── 📄 tasks.py            # Task CRUD endpoints
│   │   ├── 📄 metrics.py          # Developer metrics CRUD endpoints
│   │   └── 📄 ai.py               # AI/ML endpoints (workload, health, summary)
│   │
│   ├── 📁 services/               # Business logic & AI/ML services
│   │   ├── __init__.py
│   │   ├── 📄 ml_service.py       # Machine learning (Random Forest, Isolation Forest)
│   │   └── 📄 nlp_service.py      # Text summarization (NLP)
│   │
│   └── 📄 seed_data.py            # Database seeding with sample data
│
├── 📁 venv/                       # Python virtual environment (not in git)
│
└── 📄 .env                        # Environment variables (not in git)
    .gitignore                      # Git ignore rules
    zenycon.db                      # SQLite database (created on first run)
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app initialization, CORS setup, router registration |
| `app/config.py` | Settings from environment variables (.env file) |
| `app/database.py` | Database connection and session management |
| `app/models.py` | SQLAlchemy models defining database tables |
| `app/schemas.py` | Pydantic models for request/response validation |
| `app/routers/*.py` | API endpoints organized by resource type |
| `app/services/ml_service.py` | AI/ML algorithms (health prediction, workload analysis) |
| `app/services/nlp_service.py` | Text summarization algorithm |
| `app/seed_data.py` | Script to populate database with sample data |

### Architecture Pattern

This follows a **clean architecture** pattern:
- **Routers** → Handle HTTP requests/responses
- **Services** → Contain business logic and AI/ML algorithms
- **Models** → Database layer (SQLAlchemy)
- **Schemas** → Data validation layer (Pydantic)

This separation makes the code:
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Easy to extend

---

## 🔗 Quick API Test Commands

### Test Health Prediction
```bash
curl -X POST "http://127.0.0.1:8000/api/health" \
  -H "Content-Type: application/json" \
  -d '{"tasks": 60, "hours": 38, "bugs": 2}'
```

### Test Workload Analysis
```bash
curl -X GET "http://127.0.0.1:8000/api/workload"
```

### Test Text Summarization
```bash
curl -X POST "http://127.0.0.1:8000/api/summary" \
  -H "Content-Type: application/json" \
  -d '{"text": "Your long text here...", "max_sentences": 3}'
```

### Get All Users
```bash
curl -X GET "http://127.0.0.1:8000/api/users"
```

