from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from db import models

router = APIRouter()


@router.post("/friends")
def create_friendship(user_phone: str, friend_phone: str, db: Session = Depends(get_db)):
    # Ensure both users exist
    if not db.query(models.User).filter(models.User.phone_number == user_phone).first():
        raise HTTPException(status_code=404, detail="User not found")

    if not db.query(models.User).filter(models.User.phone_number == friend_phone).first():
        raise HTTPException(status_code=404, detail="Friend user not found")

    f = models.Friend(user_phone=user_phone, friend_phone=friend_phone)
    db.add(f)
    db.commit()
    return {"message": "Friend relationship added", "data": {"user": user_phone, "friend": friend_phone}}


@router.get("/friends")
def get_friends(db: Session = Depends(get_db)):
    return db.query(models.Friend).all()