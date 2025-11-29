from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.db import get_db
from db.models import User

router = APIRouter()

class LoginPayload(BaseModel):
    phone_number: str
    password: str

@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == payload.phone_number).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # if user.password != payload.password:
    #     raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "user": {
            "phone_number": user.phone_number,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "city": user.city
        }
    }
