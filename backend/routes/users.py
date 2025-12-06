from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.db import get_db
from db import models
from typing import Optional
from .auth import create_jwt

router = APIRouter()

class UserCreate(BaseModel):
    phone_number: str
    first_name: str
    last_name: str
    home_location: str
    city: str
    password: str

@router.post("/users")
def create_user(
    phone_number: Optional[str] = None,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    home_location: Optional[str] = None,
    curr_location: Optional[str] = None,
    city: Optional[str] = None,
    password: Optional[str] = None,
    body: Optional[UserCreate] = Body(None),
    db: Session = Depends(get_db)

):
    """
    This matches your new User schema.
    Called by the dummy user generator through POST requests.
    """
    # If JSON body sent (frontend), override query params
    if body:
        phone_number = body.phone_number
        first_name = body.first_name
        last_name = body.last_name
        home_location= body.home_location
        city = body.city
        password = body.password


    # Validate required fields
    if not phone_number:
        raise HTTPException(status_code=400, detail="phone_number is required")

    # Check for duplicate phone number
    exists = db.query(models.User).filter(models.User.phone_number == phone_number).first()
    if exists:
        raise HTTPException(status_code=400, detail="Phone number already registered.")


    user = models.User(
        phone_number=phone_number,
        first_name=first_name,
        last_name=last_name,
        home_location=home_location,
        curr_location=curr_location,
        password=password,
        city=city
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_jwt(user=user)
    
    return {"message": "Registration successful",
        "token": token,
        "user": user}

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.get("/user/by-phone/{req_phone_number}/{subj_phone_number}")
def get_user_by_phone(req_phone_number: str, subj_phone_number: str, db: Session = Depends(get_db)):
    friend_user = get_user(phone_number=subj_phone_number, db=db)

    is_friend_already = (
        db.query(models.Friend)
        .filter((models.Friend.user_phone == req_phone_number) &
    (models.Friend.friend_phone == subj_phone_number))
        .all()
    )
    return {"user": friend_user, "is_friend_already": is_friend_already}

def get_user(phone_number: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone_number == phone_number).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with number {phone_number} not found")
    
    return user



