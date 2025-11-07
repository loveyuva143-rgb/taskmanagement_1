from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, Task, TaskStatus
import random

router = APIRouter(
    prefix="/workload",
    tags=["Workload"]
)

# 🧠 Simulate AI prediction for workload
def analyze_workload(tasks):
    workload_score = len(tasks) * random.uniform(0.8, 1.2)
    risk_level = "Normal"
    if workload_score > 10:
        risk_level = "Overloaded 🚨"
    elif workload_score > 6:
        risk_level = "High ⚠️"
    return workload_score, risk_level


@router.get("/analyze")
def analyze_all_workloads(db: Session = Depends(get_db)):
    users = db.query(User).all()
    results = []

    for user in users:
        user_tasks = db.query(Task).filter(Task.assigned_to == user.id).all()
        workload_score, risk = analyze_workload(user_tasks)

        results.append({
            "developer_id": user.id,
            "developer_name": user.name,
            "role": user.role,
            "task_count": len(user_tasks),
            "workload_score": round(workload_score, 2),
            "risk_level": risk
        })

    return {"workloads": results}


@router.get("/suggest")
def suggest_reassignments(db: Session = Depends(get_db)):
    users = db.query(User).all()
    suggestions = []

    for user in users:
        tasks = db.query(Task).filter(Task.assigned_to == user.id).all()
        workload_score, risk = analyze_workload(tasks)

        if "Overloaded" in risk:
            suggestions.append({
                "developer_name": user.name,
                "suggestion": "⚙️ Reassign some tasks to balance workload."
            })
        elif "High" in risk:
            suggestions.append({
                "developer_name": user.name,
                "suggestion": "✅ Monitor workload closely."
            })
        else:
            suggestions.append({
                "developer_name": user.name,
                "suggestion": "🟢 Workload balanced."
            })

    return {"ai_suggestions": suggestions}
