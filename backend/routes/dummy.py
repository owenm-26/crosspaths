from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db.models import User
from dummy_data_scripts import users, location

router = APIRouter()

@router.get("/dummy/users")
def add_dummy_users():
    res = users.create_dummy_users()
    return {"message": res}

@router.get("/dummy/friends")
def add_dummy_friends():
    res = users.create_dummy_friendships()
    return {"message": res}


@router.get("/dummy/friend_requests")
def add_dummy_friend_requests():
    res = users.create_dummy_friend_requests()
    return {"message": res}


@router.get("/dummy/inbox")
def add_dummy_inbox_notifications():
    res = users.create_dummy_notifications()
    return {"message": res}

@router.get("/dummy/locations")
def add_dummy_locations():
    res = location.create_dummy_location()
    return {"message": res}