from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from app.models import UserRole, TaskStatus


# User Schemas
class UserBase(BaseModel):
    name: str
    role: UserRole
    email: Optional[EmailStr] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Project Schemas
class ProjectBase(BaseModel):
    name: str
    client_name: str
    start_date: datetime
    end_date: Optional[datetime] = None
    health_score: Optional[float] = 0.0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    client_name: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    health_score: Optional[float] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Task Schemas
class TaskBase(BaseModel):
    title: str
    status: TaskStatus = TaskStatus.TODO
    deadline: Optional[datetime] = None
    assigned_to: Optional[int] = None
    project_id: int


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[TaskStatus] = None
    deadline: Optional[datetime] = None
    assigned_to: Optional[int] = None
    project_id: Optional[int] = None


class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Developer Metrics Schemas
class DeveloperMetricsBase(BaseModel):
    developer_id: int
    developer_name: str
    tasks_completed: int = 0
    hours_worked: float = 0.0
    bugs_reported: int = 0


class DeveloperMetricsCreate(DeveloperMetricsBase):
    pass


class DeveloperMetricsUpdate(BaseModel):
    tasks_completed: Optional[int] = None
    hours_worked: Optional[float] = None
    bugs_reported: Optional[int] = None


class DeveloperMetricsResponse(DeveloperMetricsBase):
    id: int
    recorded_at: datetime
    
    class Config:
        from_attributes = True


# AI/ML Request/Response Schemas
class HealthPredictionRequest(BaseModel):
    tasks: int
    hours: int
    bugs: int


class HealthPredictionResponse(BaseModel):
    predicted_health: str
    confidence_score: Optional[float] = None


class WorkloadAnalysisResponse(BaseModel):
    developer: str
    hours_worked: float
    tasks_completed: int
    bugs_reported: int
    status: str  # "Overloaded" or "Normal"
    load_percentage: Optional[float] = None


class SummaryRequest(BaseModel):
    text: str
    max_sentences: Optional[int] = 5


class SummaryResponse(BaseModel):
    summary: str
    original_length: int
    summary_length: int


class TaskReassignmentSuggestion(BaseModel):
    developer: str
    current_load: float
    suggested_reassignments: List[dict]
    reason: str

