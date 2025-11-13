from fastapi import FastAPI
from db.supabase_utils import supabase_health_test

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/test")
def test_db_connection():
    auth_url = supabase_health_test()
    return {"message": f"{auth_url}"}