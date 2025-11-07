from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Project, Task, TaskStatus, User
from datetime import datetime
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import random

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

# 🔐 Security setup
SECRET_KEY = "zenycon-secret-key"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# 🧩 Utility: Decode & verify JWT token
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")
        return {"email": email, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# 🧮 Simple project health calculation
def calculate_health_score(project_id: int, db: Session):
    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    if not tasks:
        return 100.0

    completed = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
    total = len(tasks)
    progress = (completed / total) * 100

    overdue = sum(1 for t in tasks if t.deadline and t.deadline < datetime.utcnow() and t.status != TaskStatus.COMPLETED)
    overdue_penalty = min(overdue * 5, 30)  # limit penalty

    return max(0.0, progress - overdue_penalty)


# 📦 Create a new project (🔒 Protected)
@router.post("/create")
def create_project(
    name: str,
    client_name: str,
    start_date: datetime,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = Project(
        name=name,
        client_name=client_name,
        start_date=start_date
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return {
        "message": f"✅ Project created successfully by {current_user['email']}!",
        "project": project
    }


# 🧾 List all projects (🔒 Protected)
@router.get("/all")
def list_projects(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    projects = db.query(Project).all()
    for project in projects:
        project.health_score = calculate_health_score(project.id, db)
    return projects


# 🧩 Add task to project (🔒 Protected)
@router.post("/{project_id}/task")
def add_task(
    project_id: int,
    title: str,
    assigned_to: int = None,
    deadline: datetime = None,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    task = Task(
        title=title,
        project_id=project_id,
        assigned_to=assigned_to,
        deadline=deadline,
        status=TaskStatus.TODO
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {
        "message": f"🧠 Task added successfully by {current_user['email']}!",
        "task": task
    }


# 📊 Project analytics (🔒 Protected)
@router.get("/{project_id}/analytics")
def project_analytics(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    health_score = calculate_health_score(project_id, db)
    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    completed = sum(1 for t in tasks if t.status == TaskStatus.COMPLETED)
    in_progress = sum(1 for t in tasks if t.status == TaskStatus.IN_PROGRESS)
    blocked = sum(1 for t in tasks if t.status == TaskStatus.BLOCKED)

    return {
        "project_name": project.name,
        "client_name": project.client_name,
        "health_score": round(health_score, 2),
        "total_tasks": len(tasks),
        "completed": completed,
        "in_progress": in_progress,
        "blocked": blocked,
        "prediction": random.choice([
            "On Track 🚀", "Slight Delay ⚠️", "Critical 🚨"
        ]),
        "last_updated": datetime.utcnow()
    }
