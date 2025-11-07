"""
Script to seed the database with sample data.
Run this once after creating the database.
"""
from app.database import SessionLocal, engine, Base
from app.models import User, Project, Task, DeveloperMetrics, UserRole, TaskStatus
from datetime import datetime, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()


def seed_data():
    """Seed database with sample data"""
    
    # Clear existing data (optional - comment out if you want to keep existing data)
    # db.query(DeveloperMetrics).delete()
    # db.query(Task).delete()
    # db.query(Project).delete()
    # db.query(User).delete()
    # db.commit()
    
    # Create Users
    users = [
        User(name="John Doe", role=UserRole.MANAGER, email="john@zenycon.com"),
        User(name="Alice Smith", role=UserRole.DEVELOPER, email="alice@zenycon.com"),
        User(name="Bob Johnson", role=UserRole.DEVELOPER, email="bob@zenycon.com"),
        User(name="Charlie Brown", role=UserRole.DEVELOPER, email="charlie@zenycon.com"),
        User(name="Diana Prince", role=UserRole.DEVELOPER, email="diana@zenycon.com"),
        User(name="Client Corp", role=UserRole.CLIENT, email="client@corp.com"),
    ]
    
    for user in users:
        existing = db.query(User).filter(User.email == user.email).first()
        if not existing:
            db.add(user)
    
    db.commit()
    
    # Refresh to get IDs
    users = db.query(User).all()
    manager = next((u for u in users if u.role == UserRole.MANAGER), None)
    developers = [u for u in users if u.role == UserRole.DEVELOPER]
    client = next((u for u in users if u.role == UserRole.CLIENT), None)
    
    # Create Projects
    projects = [
        Project(
            name="E-Commerce Platform",
            client_name=client.name if client else "Client Corp",
            start_date=datetime.now() - timedelta(days=60),
            end_date=datetime.now() + timedelta(days=30),
            health_score=85.0
        ),
        Project(
            name="Mobile App Development",
            client_name=client.name if client else "Client Corp",
            start_date=datetime.now() - timedelta(days=30),
            end_date=datetime.now() + timedelta(days=60),
            health_score=75.0
        ),
        Project(
            name="Analytics Dashboard",
            client_name=client.name if client else "Client Corp",
            start_date=datetime.now() - timedelta(days=15),
            end_date=datetime.now() + timedelta(days=45),
            health_score=90.0
        ),
    ]
    
    for project in projects:
        existing = db.query(Project).filter(Project.name == project.name).first()
        if not existing:
            db.add(project)
    
    db.commit()
    projects = db.query(Project).all()
    
    # Create Tasks
    tasks = []
    for i, project in enumerate(projects):
        for j, dev in enumerate(developers[:2]):  # Assign to first 2 developers per project
            tasks.append(Task(
                title=f"Implement {project.name} Feature {j+1}",
                status=TaskStatus.IN_PROGRESS if j == 0 else TaskStatus.TODO,
                deadline=datetime.now() + timedelta(days=10 + j*5),
                assigned_to=dev.id,
                project_id=project.id
            ))
    
    for task in tasks:
        existing = db.query(Task).filter(
            Task.title == task.title,
            Task.project_id == task.project_id
        ).first()
        if not existing:
            db.add(task)
    
    db.commit()
    
    # Create Developer Metrics
    metrics_data = [
        {"name": "Alice Smith", "tasks": 60, "hours": 38, "bugs": 2},
        {"name": "Bob Johnson", "tasks": 45, "hours": 45, "bugs": 4},
        {"name": "Charlie Brown", "tasks": 70, "hours": 40, "bugs": 1},
        {"name": "Diana Prince", "tasks": 30, "hours": 55, "bugs": 9},
    ]
    
    for metric_data in metrics_data:
        dev = next((u for u in developers if u.name == metric_data["name"]), None)
        if dev:
            existing = db.query(DeveloperMetrics).filter(
                DeveloperMetrics.developer_id == dev.id
            ).first()
            if not existing:
                db.add(DeveloperMetrics(
                    developer_id=dev.id,
                    developer_name=dev.name,
                    tasks_completed=metric_data["tasks"],
                    hours_worked=metric_data["hours"],
                    bugs_reported=metric_data["bugs"]
                ))
    
    db.commit()
    print("✅ Database seeded successfully!")
    print(f"   - {len(db.query(User).all())} users")
    print(f"   - {len(db.query(Project).all())} projects")
    print(f"   - {len(db.query(Task).all())} tasks")
    print(f"   - {len(db.query(DeveloperMetrics).all())} metrics")


if __name__ == "__main__":
    seed_data()
    db.close()

