from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.db import db_session as db
from db import models
from routes.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

class LocationUpdate(BaseModel):
    lat: float
    lon: float

@router.post("/locations")
def create_locations(zipcode: str, city: str, state: str):
    location = models.Location(zipcode=zipcode, city=city, state=state)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

def update_user_location(db: Session, user_id: int, lat: float, lon: float):
    user = db.query(models.User).filter(models.User.phone_number == user_id).first()
    if not user:
        raise ValueError(f"User with id {user_id} doesn't exist")
    
    user.curr_location = (lat, lon)
    # user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user


@router.post("/location/update")
async def update_location(loc: LocationUpdate, user=Depends(get_current_user)):
    update_user_location(
        db=db,
        user_id=user.phone_number,
        lat=loc.lat,
        lon=loc.lon,
    )
    return {"status": "ok"}
