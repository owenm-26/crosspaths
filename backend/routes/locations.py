from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.db import get_db
from db import models

router = APIRouter()

@router.post("/locations")
def create_locations(zipcode: str, city: str, state: str, db: Session = Depends(get_db)):
    location = models.Location(zipcode=zipcode, city=city, state=state)
    db.add(location)
    db.commit()
    db.refresh(location)
    return location