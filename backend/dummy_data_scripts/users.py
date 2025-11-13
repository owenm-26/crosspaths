import requests
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.environ.get("BASE_URL")

def create_dummy_users():
    # Generate 10 dummy users
    for i in range(1, 11):
        payload = {
            "email": f"user{i}@example.com",
            "name": f"User {i}"
        }

        response = requests.post(f"{BASE_URL}/users", params=payload)

        if response.status_code == 200:
            print(f"✅ Created user {i}: {response.json()}")
        else:
            print(f"❌ Failed to create user {i}: {response.status_code}, {response.text}")
    
    return "Successfully created dummy users"
