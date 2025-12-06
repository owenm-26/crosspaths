from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from db import models
import pydantic 
from routes.auth import get_current_user


router = APIRouter()

class FriendRequestPayload(pydantic.BaseModel):
    from_phone: str
    to_phone: str

@router.post("/friend_requests")
def create_friend_request(payload: FriendRequestPayload, db: Session = Depends(get_db)):
    if payload.from_phone == payload.to_phone:
        raise HTTPException(status_code=400, detail="Cannot send friend request to yourself")


    req = models.FriendRequest(from_phone=payload.from_phone, to_phone=payload.to_phone)
    db.add(req)
    db.commit()
    return {"message": "Friend request sent"}

@router.get("/friend_requests")
def get_friend_requests(db: Session = Depends(get_db)):
    return db.query(models.FriendRequest).all()

@router.get("/friend_requests/user")
def get_friend_requests_by_phone(user=Depends(get_current_user), db: Session = Depends(get_db)):
    friend_requests = (
        db.query(models.FriendRequest).filter(models.FriendRequest.to_phone == user.phone_number).all()
    )

    return friend_requests