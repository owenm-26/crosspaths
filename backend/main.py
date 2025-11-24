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