from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.db import get_db
from db import models

router = APIRouter()

@router.post("/inbox")
def create_inbox_notification(
    notification: float,
    from_phone: str,
    to_phone: str,
    db: Session = Depends(get_db)
):
    inbox = models.Inbox(
        notification=notification,
        from_phone=from_phone,
        to_phone=to_phone,
    )
    db.add(inbox)
    db.commit()
    return {"message": "Notification added"}


@router.get("/inbox")
def get_inbox(db: Session = Depends(get_db)):
    return db.query(models.Inbox).all()
