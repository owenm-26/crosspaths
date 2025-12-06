from fastapi import APIRouter, Depends, HTTPException
from db.db import get_db
from sqlalchemy.orm import Session
from db.db import db_session as db
from routes.auth import get_current_user
from db import models

router = APIRouter()

@router.post("/users/push-token")
async def save_push_token(token: str, user=Depends(get_current_user)):
    db.save_push_token(user.phone_number, token) #TODO: fix save_push_token

@router.get("/notifications/user")
def get_notification_by_phone(user=Depends(get_current_user), db:Session=Depends(get_db)):
    notifications = (db.query(models.Inbox).filter(models.Inbox.to_phone == user.phone_number).all())

    return notifications
