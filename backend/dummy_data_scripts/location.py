import requests
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.environ.get("BASE_URL")
CSV_FILE = "/Users/aditya/Desktop/Fall 2025/CS 599/crosspaths/backend/dummy_data_scripts/uscities.csv"
def create_dummy_location(csv_file=CSV_FILE):
    # Load the CSV
    df = pd.read_csv(csv_file)
    
    # Counter for total successful requests
    success_count = 0
    
    for i, row in df.iterrows():
        # The 'zips' column often contains multiple zip codes separated by commas/spaces.
        # We need to split this into a list of individual zip codes.
        zipcodes_raw = str(row['zips']).strip().replace('"', '').replace(' ', ',')
        zipcode_list = [zc.strip() for zc in zipcodes_raw.split(',') if zc.strip()]
        
        city = str(row['city']).strip()
        state = str(row['state_id']).strip()
        
        # Iterate over each individual zip code and send a separate request
        for zipcode in zipcode_list:
            payload = {
                "zipcode": zipcode,
                "city": city,
                "state": state
            }

            response = requests.post(f"{BASE_URL}/locations", params=payload)

            if response.status_code == 200:
                print(f"✅ Created location (Row {i + 1}): {city}, {state}, {zipcode}")
                success_count += 1
            else:
                # Log the specific error for debugging
                print(f"❌ Failed to create location (Row {i + 1}): {response.status_code}, {response.text}")
                
    return f"Finished creating locations. Successfully created {success_count} records."


