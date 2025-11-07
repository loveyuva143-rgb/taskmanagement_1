from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserUpdate, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all users with pagination support.
    
    Query Parameters:
    - skip (int): Number of records to skip (default: 0)
    - limit (int): Maximum number of records to return (default: 100)
    
    Example Request:
    ```
    GET /api/users?skip=0&limit=10
    ```
    
    Example Response:
    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "role": "manager",
        "email": "john@zenycon.com",
        "created_at": "2024-01-15T10:30:00",
        "updated_at": null
      },
      {
        "id": 2,
        "name": "Alice Smith",
        "role": "developer",
        "email": "alice@zenycon.com",
        "created_at": "2024-01-15T10:31:00",
        "updated_at": null
      }
    ]
    ```
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get a specific user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user in the system.
    
    Valid roles: "admin", "manager", "developer", "client"
    
    Example Request:
    ```json
    {
      "name": "Alice Smith",
      "role": "developer",
      "email": "alice@zenycon.com"
    }
    ```
    
    Example Response:
    ```json
    {
      "id": 2,
      "name": "Alice Smith",
      "role": "developer",
      "email": "alice@zenycon.com",
      "created_at": "2024-01-15T10:31:00",
      "updated_at": null
    }
    ```
    
    Errors:
    - 400: Email already registered (if email is provided and exists)
    """
    # Check if email already exists
    if user.email:
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """Update a user"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Delete a user"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return None

