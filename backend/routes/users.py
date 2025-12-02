from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.db import get_db
from db import models
from typing import Optional

router = APIRouter()

class UserCreate(BaseModel):
    phone_number: str
    first_name: str
    last_name: str
    home_location: str
    curr_location: str
    city: str

@router.post("/users")
def create_user(
    phone_number: Optional[str] = None,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    home_location: Optional[str] = None,
    curr_location: Optional[str] = None,
    city: Optional[str] = None,
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
        home_location = body.home_location
        curr_location = body.curr_location
        city = body.city

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
        city=city
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()