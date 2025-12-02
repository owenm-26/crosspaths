from fastapi import FastAPI, APIRouter, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db.db import create_tables_orm, engine
from routes import routers
from db.models import User
from dummy_data_scripts import users, location
from pydantic import BaseModel
from db.db import get_db
from db import models
from typing import Optional
app = FastAPI()

# Include all routers
# for r in routers:
#     app.include_router(r)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/dummy/friends")
def add_dummy_friends():
    res = users.create_dummy_friendships()
    return {"message": res}

@app.get("/dummy/inbox")
def add_dummy_inbox_notifications():
    res = users.create_dummy_notifications()
    return {"message": res}

@app.post("/inbox")
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

@app.get("/dummy/locations")
def add_dummy_locations():
    res = location.create_dummy_location()
    return {"message": res}

@app.post("/locations")
def create_locations(zipcode: str, city: str, state: str, db: Session = Depends(get_db)):
    location = models.Location(zipcode=zipcode, city=city, state=state)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location



@app.get("/dummy/friend_requests")
def add_dummy_friend_requests():
    res = users.create_dummy_friend_requests()
    return {"message": res}

@app.post("/friend_requests")
def create_friend_request(from_phone: str, to_phone: str, db: Session = Depends(get_db)):
    if from_phone == to_phone:
        raise HTTPException(status_code=400, detail="Cannot send friend request to yourself")

    req = models.FriendRequest(from_phone=from_phone, to_phone=to_phone)
    db.add(req)
    db.commit()
    return {"message": "Friend request sent"}

@app.post("/friends")
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



@app.get("/reset_db")
def reset_db():
    create_tables_orm(engine)
    return {"message": "DB Dropped and Created successfully"}


@app.get("/dummy/users")
def add_dummy_users():
    res = users.create_dummy_users()
    return {"message": res}

@app.get("/dummy/friends")
def add_dummy_friends():
    res = users.create_dummy_friendships()
    return {"message": res}


@app.get("/dummy/friend_requests")
def add_dummy_friend_requests():
    res = users.create_dummy_friend_requests()
    return {"message": res}


@app.get("/dummy/inbox")
def add_dummy_inbox_notifications():
    res = users.create_dummy_notifications()
    return {"message": res}

@app.get("/dummy/locations")
def add_dummy_locations():
    res = location.create_dummy_location()
    return {"message": res}


class UserCreate(BaseModel):
    phone_number: str
    first_name: str
    last_name: str
    home_location: str
    curr_location: str
    city: str
    password: str


@app.post("/users")
def create_user(
    phone_number: Optional[str] = None,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    home_location: Optional[str] = None,
    curr_location: Optional[str] = None,
    city: Optional[str] = None,
    password: Optional[str] = None,
    body: Optional[UserCreate] = Body(None),
    db: Session = Depends(get_db)
):
    """
    Supports:
     - POST /users?phone_number=...  (dummy scripts)
     - POST /users with JSON body   (frontend)
    """

    # If JSON body exists, override query params
    if body:
        phone_number = body.phone_number
        first_name = body.first_name
        last_name = body.last_name
        home_location = body.home_location
        curr_location = body.curr_location
        city = body.city
        password = body.password

    # Validate required parameters
    required = {
        "phone_number": phone_number,
        "first_name": first_name,
        "last_name": last_name,
        "home_location": home_location,
        "curr_location": curr_location,
        "city": city,
        "password": password,
    }

    missing = [k for k, v in required.items() if not v]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    # Check duplicate phone number
    exists = db.query(models.User).filter(models.User.phone_number == phone_number).first()
    if exists:
        raise HTTPException(status_code=400, detail="Phone number already registered.")

    # Create user — password is validated + hashed via Password() column type
    user = models.User(
        phone_number=phone_number,
        first_name=first_name,
        last_name=last_name,
        home_location=home_location,
        curr_location=curr_location,
        city=city,
        password=password,  # PasswordHash validator will hash this
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()