from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.db import get_db
from db.models import User
import jwt
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta, timezone

load_dotenv()

SECRET_KEY = os.environ.get("SECRET_JWT_PASSWORD")
ALGORITHM = "HS256"
assert SECRET_KEY != None

router = APIRouter()

def create_jwt(user: User) ->dict:
     # Create JWT token
    token_data = {
        "user_id": user.phone_number,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)  # token expires in 7 days
    }
    return jwt.encode(payload=token_data, key=SECRET_KEY, algorithm=ALGORITHM)

class LoginPayload(BaseModel):
    phone_number: str
    password: str

@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone_number == payload.phone_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create JWT token
    token = create_jwt(user=user)

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "phone_number": user.phone_number,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "city": user.city
        }
    }


def get_current_user(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
) -> User:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user