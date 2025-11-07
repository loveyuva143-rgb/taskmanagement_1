from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import DeveloperMetrics, User
from app.schemas import DeveloperMetricsCreate, DeveloperMetricsUpdate, DeveloperMetricsResponse

router = APIRouter(prefix="/api/metrics", tags=["metrics"])


@router.get("/", response_model=List[DeveloperMetricsResponse])
def get_metrics(skip: int = 0, limit: int = 100, developer_id: int = None, db: Session = Depends(get_db)):
    """Get all developer metrics, optionally filtered by developer"""
    query = db.query(DeveloperMetrics)
    if developer_id:
        query = query.filter(DeveloperMetrics.developer_id == developer_id)
    metrics = query.order_by(DeveloperMetrics.recorded_at.desc()).offset(skip).limit(limit).all()
    return metrics


@router.get("/{metric_id}", response_model=DeveloperMetricsResponse)
def get_metric(metric_id: int, db: Session = Depends(get_db)):
    """Get a specific metric by ID"""
    metric = db.query(DeveloperMetrics).filter(DeveloperMetrics.id == metric_id).first()
    if not metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    return metric


@router.post("/", response_model=DeveloperMetricsResponse, status_code=201)
def create_metric(metric: DeveloperMetricsCreate, db: Session = Depends(get_db)):
    """
    Create a new developer metric entry.
    
    Tracks developer performance metrics including tasks completed, hours worked,
    and bugs reported. These metrics are used by the AI workload analyzer.
    
    Example Request:
    ```json
    {
      "developer_id": 2,
      "developer_name": "Alice Smith",
      "tasks_completed": 60,
      "hours_worked": 38.0,
      "bugs_reported": 2
    }
    ```
    
    Example Response:
    ```json
    {
      "id": 1,
      "developer_id": 2,
      "developer_name": "Alice Smith",
      "tasks_completed": 60,
      "hours_worked": 38.0,
      "bugs_reported": 2,
      "recorded_at": "2024-01-15T10:30:00"
    }
    ```
    
    Errors:
    - 404: Developer not found (if developer_id doesn't exist)
    """
    # Verify developer exists
    user = db.query(User).filter(User.id == metric.developer_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Developer not found")
    
    db_metric = DeveloperMetrics(**metric.model_dump())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric


@router.put("/{metric_id}", response_model=DeveloperMetricsResponse)
def update_metric(metric_id: int, metric_update: DeveloperMetricsUpdate, db: Session = Depends(get_db)):
    """Update a metric"""
    db_metric = db.query(DeveloperMetrics).filter(DeveloperMetrics.id == metric_id).first()
    if not db_metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    
    update_data = metric_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_metric, key, value)
    
    db.commit()
    db.refresh(db_metric)
    return db_metric


@router.delete("/{metric_id}", status_code=204)
def delete_metric(metric_id: int, db: Session = Depends(get_db)):
    """Delete a metric"""
    db_metric = db.query(DeveloperMetrics).filter(DeveloperMetrics.id == metric_id).first()
    if not db_metric:
        raise HTTPException(status_code=404, detail="Metric not found")
    
    db.delete(db_metric)
    db.commit()
    return None

