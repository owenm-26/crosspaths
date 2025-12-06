from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from db.db import get_db
from db import models
from routes.auth import get_current_user
from db.notification_codes import NotificationCode
from interfaces.friendship import FriendshipPayload, FriendRequestPayload

router = APIRouter()



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
        db.query(models.FriendRequest)
        .options(joinedload(models.FriendRequest.user))  # eager load the 'user' relationship
        .filter(
            models.FriendRequest.to_phone == user.phone_number,
            models.FriendRequest.accepted == 0  # Only pending requests
        )
        .all()
    )


    result = [
        {
            "from_phone": fr.from_phone,
            "first_name": fr.user.first_name if fr.user else None,
            "last_name": fr.user.last_name if fr.user else None
        }
        for fr in friend_requests
    ]


    return result

@router.post("/friend_request/deny")
def deny_friend_request(payload: FriendshipPayload, db: Session = Depends(get_db)):

    # Ensure both users exist
    if not db.query(models.User).filter(models.User.phone_number == payload.user_phone).first():
        raise HTTPException(status_code=404, detail="User not found")

    if not db.query(models.User).filter(models.User.phone_number == payload.friend_phone).first():
        raise HTTPException(status_code=404, detail="Friend user not found")
    
    # Sort phone numbers so small one always goes first
    u1, u2 = sorted([payload.user_phone, payload.friend_phone])

    # delete friend request and create notifications
    take_action_on_friend_request_and_send_notification(u1=u1, u2=u2, accept=False, db=db)
    db.commit()
    return {"message": "Friend relationship denied", "data": {"user": u1, "friend": u2}}


def take_action_on_friend_request_and_send_notification(u1: models.User, u2: models.User, accept:bool, db: Session = Depends(get_db)):
    """Reusable logic that either accepts or denies a friend request and deletes it from the table before
    creating a new notification of what happened"""
    friend_reqs = (
        db.query(models.FriendRequest)
        .filter(
            ((models.FriendRequest.from_phone == u1) & (models.FriendRequest.to_phone == u2))
            | ((models.FriendRequest.from_phone == u2) & (models.FriendRequest.to_phone == u1))
                ).all()
    )
    for req in friend_reqs:
        db.delete(req)
    # and create notification
    notifs = []
    actor = ""
    receiver = ""
    status
    if accept:
        actor = req.from_phone
        receiver = req.to_phone
        status = NotificationCode.FRIEND_ACCEPTED
    else:
        actor = req.to_phone
        receiver = req.from_phone
        status = NotificationCode.FRIEND_DENIED
    for req in friend_reqs:
        n = models.Inbox(notification=status, from_phone=actor, to_phone=receiver)
        notifs.append(n)
    db.add_all(notifs)