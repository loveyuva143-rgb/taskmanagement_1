from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.services.ml_service import ml_service
from app.services.nlp_service import nlp_service
from app.schemas import (
    HealthPredictionRequest,
    HealthPredictionResponse,
    WorkloadAnalysisResponse,
    SummaryRequest,
    SummaryResponse,
    TaskReassignmentSuggestion
)

router = APIRouter(prefix="/api", tags=["ai"])


@router.get("/workload", response_model=List[WorkloadAnalysisResponse])
def get_workload_analysis(db: Session = Depends(get_db)):
    """
    Get AI-powered workload analysis for all developers.
    
    Uses Isolation Forest (an anomaly detection algorithm) to identify developers
    who may be overloaded based on their working hours, tasks completed, and bug counts.
    
    Returns:
        List of developer workload analyses with status ("Normal" or "Overloaded")
        and load percentage.
    
    Example Response:
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
        "developer": "Diana Prince",
        "hours_worked": 55.0,
        "tasks_completed": 30,
        "bugs_reported": 9,
        "status": "Overloaded",
        "load_percentage": 137.5
      }
    ]
    ```
    """
    results = ml_service.analyze_workload(db)
    return results


@router.post("/health", response_model=HealthPredictionResponse)
def predict_health(request: HealthPredictionRequest):
    """
    Predict project health based on workload metrics using Machine Learning.
    
    Uses a Random Forest Classifier trained on historical project data to predict
    whether a project's health status is "Excellent", "Good", "Fair", or "Poor"
    based on workload metrics.
    
    Request Body:
    - tasks (int): Number of tasks completed
    - hours (int): Hours worked
    - bugs (int): Number of bugs reported
    
    Returns:
        Predicted health status and confidence score (0-1, where 1 is most confident)
    
    Example Request:
    ```json
    {
      "tasks": 60,
      "hours": 38,
      "bugs": 2
    }
    ```
    
    Example Response:
    ```json
    {
      "predicted_health": "Excellent",
      "confidence_score": 0.85
    }
    ```
    
    Possible health values:
    - "Excellent": High task completion, reasonable hours, low bugs
    - "Good": Good task completion, moderate hours, few bugs
    - "Fair": Average performance metrics
    - "Poor": Low task completion, high hours, many bugs
    """
    predicted_health, confidence = ml_service.predict_health(
        request.tasks,
        request.hours,
        request.bugs
    )
    
    return HealthPredictionResponse(
        predicted_health=predicted_health,
        confidence_score=round(confidence, 3)
    )


@router.post("/summary", response_model=SummaryResponse)
def summarize_text(request: SummaryRequest):
    """
    Summarize text using extractive summarization (no external API required).
    
    This endpoint uses a simple NLP algorithm to extract the most important sentences
    from a block of text, perfect for summarizing meeting notes, reports, or documents.
    
    Request Body:
    - text (string): The text to summarize
    - max_sentences (int, optional): Maximum number of sentences in summary (default: 5)
    
    Returns:
        Summarized text along with original and summary lengths
    
    Example Request:
    ```json
    {
      "text": "Today we discussed the project timeline. The team made good progress on feature X. We identified some blockers that need attention. Next steps include completing the integration tests. The deadline is approaching fast.",
      "max_sentences": 3
    }
    ```
    
    Example Response:
    ```json
    {
      "summary": "Today we discussed the project timeline. We identified some blockers that need attention. The deadline is approaching fast.",
      "original_length": 185,
      "summary_length": 95
    }
    ```
    
    Note: This uses a simple extractive algorithm based on word frequency.
    For production use, consider integrating with more advanced NLP services.
    """
    summary = nlp_service.summarize_text(request.text, request.max_sentences or 5)
    
    return SummaryResponse(
        summary=summary,
        original_length=len(request.text),
        summary_length=len(summary)
    )


@router.get("/reassignments", response_model=List[TaskReassignmentSuggestion])
def get_reassignment_suggestions(db: Session = Depends(get_db)):
    """
    Get AI-powered task reassignment suggestions for overloaded developers.
    
    Automatically identifies developers working at 120%+ capacity and suggests
    reassigning their tasks to developers with available capacity. This helps
    prevent burnout and optimize team workload distribution.
    
    Returns:
        List of reassignment suggestions with details about:
        - Which developer is overloaded
        - Their current load percentage
        - Suggested reassignments
        - Reasoning for the suggestion
    
    Example Response:
    ```json
    [
      {
        "developer": "Diana Prince",
        "current_load": 137.5,
        "suggested_reassignments": [
          {
            "from": "Diana Prince",
            "to": "Alice Smith",
            "reason": "Developer is 137.5% loaded. Alice Smith has capacity."
          }
        ],
        "reason": "Overloaded at 137.5% capacity"
      }
    ]
    ```
    
    Note: Returns empty list if no developers are overloaded (120%+ capacity).
    """
    suggestions = ml_service.suggest_task_reassignments(db)
    return suggestions

