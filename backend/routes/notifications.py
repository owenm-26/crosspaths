from fastapi import APIRouter, Depends
import auth
from db.db import get_db
from sqlalchemy.orm import Session
from db.db import db_session as db
from routes.auth import get_current_user

router = APIRouter()

@router.post("/users/push-token")
async def save_push_token(token: str, user=Depends(get_current_user)):
    db.save_push_token(user.id, token)
