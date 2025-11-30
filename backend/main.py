from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.db import create_tables_orm, engine
from routes import routers

app = FastAPI()

# include all routers
for r in routers:
    app.include_router(r)

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

@app.get("/reset_db")
def reset_db():
    create_tables_orm(engine=engine)
    return {"message": "DB Dropped and Created successfully"}


