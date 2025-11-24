import requests
import random
import os
from dotenv import load_dotenv

load_dotenv()
BASE_URL = os.environ.get("BASE_URL")

# -------------------------------------------------------------------
# LARGE NAME LISTS
# -------------------------------------------------------------------

FIRST_NAMES = [
    "Alex", "Jordan", "Casey", "Taylor", "Morgan", "Chris", "Sam", "Riley", "Jamie", "Avery",
    "Ethan", "Olivia", "Noah", "Emma", "Liam", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia",
    "Elijah", "Logan", "Mason", "Lucas", "Benjamin", "Henry", "James", "Alexander", "Daniel",
    "Ella", "Grace", "Chloe", "Harper", "Zoe", "Luna", "Scarlett", "Violet", "Nora", "Hannah",
    "Leo", "Jack", "Owen", "Theo", "Mateo", "Julian", "Miles", "Isaac", "Caleb", "Wyatt"
]

LAST_NAMES = [
    "Smith", "Johnson", "Lee", "Brown", "Garcia", "Martinez", "Davis", "Lopez", "Wilson", "Anderson",
    "Clark", "Rodriguez", "Lewis", "Walker", "Hall", "Young", "Allen", "King", "Wright", "Scott",
    "Torres", "Nguyen", "Hill", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell",
    "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins",
    "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey"
]

# -------------------------------------------------------------------
# CITY + COORD DATA
# -------------------------------------------------------------------

CITIES = [
    ("New York",      (40.6943, -73.9249)),
    ("Los Angeles",   (34.1141, -118.4068)),
    ("Chicago",       (41.8375, -87.6866)),
    ("Miami",         (25.7840, -80.2101)),
    ("Dallas",        (32.7935, -96.7667)),
    ("Washington",    (38.9047, -77.0163)),
    ("Boston",        (42.3188, -71.0852)),
    ("Phoenix",       (33.5722, -112.0892)),
    ("Seattle",       (47.6211, -122.3244)),
    ("San Francisco", (37.7558, -122.4449)),
    ("San Diego",     (32.8313, -117.1222)),
]


# -------------------------------------------------------------------
# USER GENERATION
# -------------------------------------------------------------------

def generate_unique_phone_numbers(n):
    numbers = set()
    while len(numbers) < n:
        num = random.randint(2000000000, 9999999999)
        numbers.add(str(num))
    return list(numbers)


def create_dummy_users(count=100):
    print("\n======== Creating Users ========")
    phone_numbers = generate_unique_phone_numbers(count)
    users = []

    for i in range(count):
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)

        city_name, (lat, lng) = random.choice(CITIES)
        loc_str = f"({lat}, {lng})"

        payload = {
            "phone_number": phone_numbers[i],
            "first_name": first,
            "last_name": last,
            "home_location": loc_str,
            "curr_location": loc_str,
            "city": city_name,
            "notif_enabled": 0.0,
        }

        r = requests.post(f"{BASE_URL}/users", json=payload)

        if r.status_code == 200:
            print(f"✅ User {i+1} created: {phone_numbers[i]}")
            users.append(phone_numbers[i])
        else:
            print(f"❌ Error creating user {i+1}: {r.text}")

    return users


# -------------------------------------------------------------------
# FRIENDSHIPS
# -------------------------------------------------------------------

def create_friendships(users, count=300):
    print("\n======== Creating Friendships ========")
    pairs = set()

    while len(pairs) < count:
        u, f = random.sample(users, 2)
        if (u, f) not in pairs and (f, u) not in pairs:
            pairs.add((u, f))

    for user_phone, friend_phone in pairs:
        payload = {
            "user_phone": user_phone,
            "friend_phone": friend_phone
        }

        r = requests.post(f"{BASE_URL}/friends", json=payload)

        if r.status_code == 200:
            print(f"🤝 Friendship: {user_phone} ↔ {friend_phone}")
        else:
            print(f"❌ Error creating friendship: {r.text}")


# -------------------------------------------------------------------
# FRIEND REQUESTS
# -------------------------------------------------------------------

def create_friend_requests(users, count=80):
    print("\n======== Creating Friend Requests ========")
    requests_set = set()

    while len(requests_set) < count:
        u, f = random.sample(users, 2)
        if (u, f) not in requests_set:
            requests_set.add((u, f))

    for from_p, to_p in requests_set:
        payload = {
            "from_phone": from_p,
            "to_phone": to_p,
            "accepted": 0.0
        }

        r = requests.post(f"{BASE_URL}/friend_requests", json=payload)

        if r.status_code == 200:
            print(f"📨 Friend Request: {from_p} → {to_p}")
        else:
            print(f"❌ Error creating friend request: {r.text}")


# -------------------------------------------------------------------
# NOTIFICATIONS
# -------------------------------------------------------------------

def create_notifications(users, count=200):
    print("\n======== Creating Inbox Notifications ========")
    for i in range(count):
        from_p, to_p = random.sample(users, 2)

        payload = {
            "notification": random.randint(1, 999999),
            "from_phone": from_p,
            "to_phone": to_p
        }

        r = requests.post(f"{BASE_URL}/inbox", json=payload)

        if r.status_code == 200:
            print(f"🔔 Notification: {from_p} → {to_p}")
        else:
            print(f"❌ Error creating notification: {r.text}")



