from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Task, Project, User
from app.schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/", response_model=List[TaskResponse])
def get_tasks(skip: int = 0, limit: int = 100, project_id: int = None, db: Session = Depends(get_db)):
    """Get all tasks, optionally filtered by project"""
    query = db.query(Task)
    if project_id:
        query = query.filter(Task.project_id == project_id)
    tasks = query.offset(skip).limit(limit).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a specific task by ID"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """
    Create a new task.
    
    Valid status values: "todo", "in_progress", "completed", "blocked"
    
    Example Request:
    ```json
    {
      "title": "Implement user authentication",
      "status": "in_progress",
      "deadline": "2024-02-15T00:00:00",
      "assigned_to": 2,
      "project_id": 1
    }
    ```
    
    Example Response:
    ```json
    {
      "id": 1,
      "title": "Implement user authentication",
      "status": "in_progress",
      "deadline": "2024-02-15T00:00:00",
      "assigned_to": 2,
      "project_id": 1,
      "created_at": "2024-01-15T10:30:00",
      "updated_at": null
    }
    ```
    
    Errors:
    - 404: Project not found (if project_id doesn't exist)
    - 404: Assigned user not found (if assigned_to doesn't exist)
    """
    # Verify project exists
    project = db.query(Project).filter(Project.id == task.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Verify assigned user exists (if provided)
    if task.assigned_to:
        user = db.query(User).filter(User.id == task.assigned_to).first()
        if not user:
            raise HTTPException(status_code=404, detail="Assigned user not found")
    
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    """Update a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.model_dump(exclude_unset=True)
    
    # Verify project exists (if updating)
    if "project_id" in update_data:
        project = db.query(Project).filter(Project.id == update_data["project_id"]).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
    
    # Verify assigned user exists (if updating)
    if "assigned_to" in update_data and update_data["assigned_to"]:
        user = db.query(User).filter(User.id == update_data["assigned_to"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="Assigned user not found")
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return None

