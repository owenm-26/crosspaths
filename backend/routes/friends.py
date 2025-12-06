from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from db import models
import geopy.distance
from .users import get_user
from typing import List
from db.notification_codes import NotificationCode
import pydantic

router = APIRouter()

class FriendshipPayload(pydantic.BaseModel):
    user_phone: str
    friend_phone: str

@router.post("/friends")
def create_friendship(payload: FriendshipPayload, db: Session = Depends(get_db)):
    # Ensure both users exist
    if not db.query(models.User).filter(models.User.phone_number == payload.user_phone).first():
        raise HTTPException(status_code=404, detail="User not found")

    if not db.query(models.User).filter(models.User.phone_number == payload.friend_phone).first():
        raise HTTPException(status_code=404, detail="Friend user not found")
    
    # Sort phone numbers so small one always goes first
    u1, u2 = sorted([payload.user_phone, payload.friend_phone])

    # Check existing friendship
    existing = (
        db.query(models.Friend)
        .filter(models.Friend.user_phone == u1,
                models.Friend.friend_phone == u2)
        .first()
    )

    if existing:
        return {"message": "Already friends"}
    
    # delete friend request 
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
    for req in friend_reqs:
        n = models.Inbox(notification=NotificationCode.FRIEND_ACCEPTED, from_phone=req.from_phone, to_phone=req.to_phone)
        notifs.append(n)
    db.add_all(notifs)

    f = models.Friend(user_phone=u1, friend_phone=u2)
    db.add(f)
    db.commit()
    return {"message": "Friend relationship added", "data": {"user": u1, "friend": u2}}


@router.get("/friends")
def get_friends(db: Session = Depends(get_db)):
    return db.query(models.Friend).all()

@router.get("/friend_distances")
def get_friend_distances(user_phone: str, db: Session = Depends(get_db)):
    """Return a list of the user's friends with their distances to the user."""

    # Ensure user exists
    user = (
        db.query(models.User)
        .filter(models.User.phone_number == user_phone)
        .first()
    )
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.curr_location or user.curr_location[0] != "(" or user.curr_location[-1] != ")":
        print(f"User's curr_location is malformed: {user.curr_location}")
        return []
    
    # 1) Get Friend rows that involve this user
    friend_rows: List[models.Friend] = (
        db.query(models.Friend)
        .filter(
            (models.Friend.user_phone == user_phone) |
            (models.Friend.friend_phone == user_phone)
        )
        .all()
    )

    # 2) Build a set of the *other* phone numbers
    friend_phones = set()
    for fr in friend_rows:
        # pick the other side of the pair
        if fr.user_phone == user_phone:
            friend_phones.add(fr.friend_phone)
        else:
            friend_phones.add(fr.user_phone)

    if not friend_phones:
        return []

    # 3) Fetch the User rows for those phone numbers in one query
    friends = (
        db.query(models.User)
        .filter(models.User.phone_number.in_(list(friend_phones)))
        .all()
    )

    friend_distances = []

    for friend in friends:
        if not friend.curr_location:
            print(f"Friend {friend.phone_number} has a null location. Skipping.")
            continue
        friend_distances.append(
            {
                "user": friend,
                "distance": get_distance_between_users(user1=user, user2=friend),
            }
        )

    return friend_distances


def get_distance_between_users(user1: models.User, user2: models.User) -> float:
    loc1 = convert_coordinates_to_floats(str_coordinates=user1.curr_location)
    loc2= convert_coordinates_to_floats(str_coordinates=user2.curr_location)
    return geopy.distance.distance(loc1, loc2).miles

def convert_coordinates_to_floats(str_coordinates: str) -> tuple[float]:
    s = str_coordinates[1:-1]
    nums = s.split(",")

    return (float(nums[0]), float(nums[1]))

@router.get("/user/by-phone/{req_phone_number}/{subj_phone_number}")
def get_user_by_phone(req_phone_number: str, subj_phone_number: str, db: Session = Depends(get_db)):
    friend_user = get_user(phone_number=subj_phone_number, db=db)

    u1, u2 = sorted([req_phone_number, subj_phone_number])

    is_friend_already = (
        db.query(models.Friend)
        .filter((models.Friend.user_phone == u1) &
    (models.Friend.friend_phone == u2))
        .first()
    ) != None

    already_pending_friend = (
        db.query(models.FriendRequest)
        .filter((models.FriendRequest.from_phone == u1) & 
        (models.FriendRequest.to_phone == u2))
        .first()
    ) != None
    return {"user": friend_user, "is_friend_already": is_friend_already, "already_pending_friend": already_pending_friend}

@router.delete("/remove-friend/by-phone/{req_phone_number}/{subj_phone_number}")
def remove_friendship(req_phone_number: str, subj_phone_number: str, db: Session = Depends(get_db)):
    # Query both directions of the friendship
    friendships = db.query(models.Friend).filter(
        ((models.Friend.user_phone == req_phone_number) & (models.Friend.friend_phone == subj_phone_number)) |
        ((models.Friend.user_phone == subj_phone_number) & (models.Friend.friend_phone == req_phone_number))
    ).all()

    if not friendships:
        raise HTTPException(status_code=404, detail="Friendship not found")

    for friendship in friendships:
        db.delete(friendship)

    db.commit()
    return {"message": f"Friendship between {req_phone_number} and {subj_phone_number} removed"}
