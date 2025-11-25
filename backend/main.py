from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from db import models
from db.db import db_connect, create_session, create_tables_orm
from dummy_data_scripts import users, location
app = FastAPI()

engine, connection = db_connect()
db_session: Session = create_session(engine=engine)

@app.get("/")
async def root():
    return {"message": "Hello World"}

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

# Dependency to get a DB session
def get_db():
    try:
        yield db_session
    finally:
        db_session.close()

@app.get("/reset_db")
def reset_db():
    create_tables_orm(engine=engine)
    return {"message": "DB Dropped and Created successfully"}

@app.get("/dummy/users")
def add_dummy_users():
    res = users.create_dummy_users()
    return {"message": res}

@app.post("/users")
def create_user(
    phone_number: str,
    first_name: str,
    last_name: str,
    home_location: str,
    curr_location: str,
    city: str,
    db: Session = Depends(get_db)
):
    """
    This matches your new User schema.
    Called by the dummy user generator through POST requests.
    """

    user = models.User(
        phone_number=phone_number,
        first_name=first_name,
        last_name=last_name,
        home_location=home_location,
        curr_location=curr_location,
        city=city
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/dummy/locations")
def add_dummy_locations():
    res = location.create_dummy_location()
    return {"message": res}

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@app.post("/users")
def create_user(email: str, name: str, db: Session = Depends(get_db)):
    user = models.User(email=email, name=name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user



@app.post("/locations")
def create_locations(zipcode: str, city: str, state: str, db: Session = Depends(get_db)):
    location = models.Location(zipcode=zipcode, city=city, state=state)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

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


@app.get("/friends")
def get_friends(db: Session = Depends(get_db)):
    return db.query(models.Friend).all()


# -----------------------------------------
# FRIEND REQUESTS
# -----------------------------------------
@app.post("/friend_requests")
def create_friend_request(from_phone: str, to_phone: str, db: Session = Depends(get_db)):
    if from_phone == to_phone:
        raise HTTPException(status_code=400, detail="Cannot send friend request to yourself")

    req = models.FriendRequest(from_phone=from_phone, to_phone=to_phone)
    db.add(req)
    db.commit()
    return {"message": "Friend request sent"}


@app.get("/friend_requests")
def get_friend_requests(db: Session = Depends(get_db)):
    return db.query(models.FriendRequest).all()


# -----------------------------------------
# INBOX NOTIFICATIONS
# -----------------------------------------
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


@app.get("/inbox")
def get_inbox(db: Session = Depends(get_db)):
    return db.query(models.Inbox).all()
