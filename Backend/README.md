# Zenycon Insight - Backend API

Complete FastAPI backend for the Project Intelligence Platform with AI/ML-powered analytics.

## 🚀 Features

- **AI Workload Analyzer**: Detects overloaded developers using Isolation Forest
- **Project Health Predictor**: ML model to predict project health status
- **Text Summarization**: Extract summaries from meeting notes or text
- **Task Reassignment Suggestions**: Auto-suggestions for overloaded developers
- **Full CRUD APIs**: Users, Projects, Tasks, and Developer Metrics
- **SQLite Database**: Lightweight, local database solution

## 📁 Project Structure

```
Backend/
├── app/
│   ├── __init__.py
│   ├── config.py              # Configuration & settings
│   ├── database.py             # SQLAlchemy setup
│   ├── models.py               # Database models
│   ├── schemas.py              # Pydantic schemas
│   ├── routers/                # API route handlers
│   │   ├── users.py
│   │   ├── projects.py
│   │   ├── tasks.py
│   │   ├── metrics.py
│   │   └── ai.py               # AI/ML endpoints
│   └── services/               # Business logic
│       ├── ml_service.py       # Machine learning services
│       └── nlp_service.py       # NLP/text processing
├── main.py                     # FastAPI app entry point
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── seed_data.py                # Database seeding script
```

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd Backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

### 2. Configure Environment

The `.env` file is already configured. You can modify it if needed:

```env
DATABASE_URL=sqlite:///./zenycon.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Initialize Database

```bash
python app/seed_data.py
```

This creates the database and seeds it with sample data:
- 6 users (1 manager, 4 developers, 1 client)
- 3 projects
- Multiple tasks
- Developer metrics

### 4. Run the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔗 API Endpoints

### AI/ML Endpoints

- `GET /api/workload` - Get workload analysis for all developers
- `POST /api/health` - Predict project health
  ```json
  {
    "tasks": 60,
    "hours": 38,
    "bugs": 2
  }
  ```
- `POST /api/summary` - Summarize text
  ```json
  {
    "text": "Your meeting notes...",
    "max_sentences": 5
  }
  ```
- `GET /api/reassignments` - Get task reassignment suggestions

### CRUD Endpoints

#### Users
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

#### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### Tasks
- `GET /api/tasks` - List all tasks (supports `?project_id=X`)
- `GET /api/tasks/{id}` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

#### Developer Metrics
- `GET /api/metrics` - List all metrics (supports `?developer_id=X`)
- `GET /api/metrics/{id}` - Get metric by ID
- `POST /api/metrics` - Create metric
- `PUT /api/metrics/{id}` - Update metric
- `DELETE /api/metrics/{id}` - Delete metric

## 🗄️ Database Schema

### Users
- `id`, `name`, `role` (admin/manager/developer/client), `email`, `created_at`, `updated_at`

### Projects
- `id`, `name`, `client_name`, `start_date`, `end_date`, `health_score`, `created_at`, `updated_at`

### Tasks
- `id`, `title`, `status` (todo/in_progress/completed/blocked), `deadline`, `assigned_to`, `project_id`, `created_at`, `updated_at`

### Developer Metrics
- `id`, `developer_id`, `developer_name`, `tasks_completed`, `hours_worked`, `bugs_reported`, `recorded_at`

## 🤖 AI/ML Features

### Workload Analyzer
Uses **Isolation Forest** to detect anomalies (overloaded developers) based on:
- Hours worked
- Tasks completed
- Bugs reported

### Health Predictor
Uses **Random Forest Classifier** to predict project health:
- Input: tasks, hours, bugs
- Output: "Excellent", "Good", "Fair", or "Poor"

### Text Summarizer
Extractive summarization using:
- Sentence scoring based on word frequency
- Stop word filtering
- Top N sentences selection

### Task Reassignment
Automatically suggests reassignments for developers at 120%+ capacity.

## 🔒 Security Notes

- CORS is enabled for `localhost:5173` (your frontend)
- Currently no authentication (add as needed for production)
- SQLite database is local-only

## 📝 Example Requests

### Create a Developer Metric
```bash
curl -X POST "http://localhost:8000/api/metrics" \
  -H "Content-Type: application/json" \
  -d '{
    "developer_id": 2,
    "developer_name": "Alice Smith",
    "tasks_completed": 60,
    "hours_worked": 38,
    "bugs_reported": 2
  }'
```

### Predict Health
```bash
curl -X POST "http://localhost:8000/api/health" \
  -H "Content-Type: application/json" \
  -d '{
    "tasks": 60,
    "hours": 38,
    "bugs": 2
  }'
```

### Summarize Text
```bash
curl -X POST "http://localhost:8000/api/summary" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Long meeting notes here...",
    "max_sentences": 3
  }'
```

## 🧪 Testing

Use the interactive Swagger UI at http://localhost:8000/docs to test all endpoints.

## 📦 Dependencies

- FastAPI 0.120.4
- SQLAlchemy 2.0.36
- Pydantic 2.12.3
- scikit-learn 1.7.2
- pandas 2.3.3
- numpy 2.3.4
- uvicorn 0.38.0

## 🎯 Next Steps

1. Run `python app/seed_data.py` to populate sample data
2. Start the server: `uvicorn main:app --reload`
3. Visit http://localhost:8000/docs to explore the API
4. Connect your frontend to `http://localhost:8000`

---

## 🚀 How to Run

### Quick Start

```bash
# 1. Navigate to Backend directory
cd Backend

# 2. Activate virtual environment (if not already active)
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

# 3. Install dependencies (if not already installed)
pip install -r requirements.txt

# 4. Initialize database with sample data (first time only)
python init_db.py

# 5. Start the FastAPI server
uvicorn main:app --reload
```

### Access the API

Once the server is running:
- **API Base URL**: http://127.0.0.1:8000
- **Interactive API Docs**: http://127.0.0.1:8000/docs (Swagger UI)
- **Alternative Docs**: http://127.0.0.1:8000/redoc (ReDoc)

### Verify It's Working

1. Visit http://127.0.0.1:8000 - You should see a welcome message
2. Visit http://127.0.0.1:8000/docs - You should see the Swagger UI with all endpoints
3. Try the `/api/workload` endpoint to see workload analysis

The server will automatically reload when you make changes to the code (`--reload` flag).

