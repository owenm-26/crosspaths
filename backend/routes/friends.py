from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from db import models
import geopy.distance

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

    # Query the user's friends
    friends = (
        db.query(models.User)
        .join(models.Friend, models.Friend.friend_phone == models.User.phone_number)
        .filter(models.Friend.user_phone == user.phone_number)
        .all()
    )

    friend_distances = []

    for friend in friends:
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