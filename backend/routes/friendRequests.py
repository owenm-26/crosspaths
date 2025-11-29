from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from db import models

router = APIRouter()

@router.post("/friend_requests")
def create_friend_request(from_phone: str, to_phone: str, db: Session = Depends(get_db)):
    if from_phone == to_phone:
        raise HTTPException(status_code=400, detail="Cannot send friend request to yourself")

    req = models.FriendRequest(from_phone=from_phone, to_phone=to_phone)
    db.add(req)
    db.commit()
    return {"message": "Friend request sent"}

@router.get("/friend_requests")
def get_friend_requests(db: Session = Depends(get_db)):
    return db.query(models.FriendRequest).all()