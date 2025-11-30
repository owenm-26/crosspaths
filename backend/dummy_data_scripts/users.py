import requests
import random
import os
from dotenv import load_dotenv
import string
import requests


load_dotenv()

BASE_URL = os.environ.get("BASE_URL")


# -------- City + coordinate data ---------

CITIES = [
    ("New York", (40.6943, -73.9249)),
    ("Los Angeles", (34.1141, -118.4068)),
    ("Chicago", (41.8375, -87.6866)),
    ("Miami", (25.784, -80.2101)),
    ("Dallas", (32.7935, -96.7667)),
    ("Washington", (38.9047, -77.0163)),
    ("Boston", (42.3188, -71.0852)),
    ("Phoenix", (33.5722, -112.0892)),
    ("Seattle", (47.6211, -122.3244)),
    ("San Francisco", (37.7558, -122.4449)),
    ("San Diego", (32.8313, -117.1222)),
]

FIRST_NAMES = [
    "Alice","Bob","Charlie","Diana","Evan","Fiona","Grace","Henry",
    "Isabella","Jack","Karen","Liam","Mona","Noah","Olivia","Paul",
    "Quinn","Riley","Sophia","Tom","Uma","Victor","Wendy","Xavier",
    "Yara","Zane"
]

LAST_NAMES = [
    "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller",
    "Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez",
    "Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin"
]


def random_phone():
    """Generate a random 10-digit phone number."""
    return str(random.randint(1000000000, 9999999999))


def create_dummy_users(count: int = 100):
    created = 0

    for _ in range(count):
        city, (lat, lng) = random.choice(CITIES)
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        password = random_password()

        payload = {
            "phone_number": random_phone(),
            "first_name": first,
            "last_name": last,
            "home_location": f"({lat}, {lng})",
            "curr_location": f"({lat}, {lng})",
            "city": city,
            "password": password,
        }

        r = requests.post(f"{BASE_URL}/users", params=payload)

        if r.status_code == 200:
            created += 1
        else:
            print(f"❌ Failed ({r.status_code}): {r.text}")

    return f"Successfully created {created} users"

def get_all_phone_numbers():
    r = requests.get(f"{BASE_URL}/users")
    if r.status_code != 200:
        print("❌ Failed to fetch users")
        return []

    return [u["phone_number"] for u in r.json()]

def random_password(min_len=8, max_len=16):
    """Generate a random password with variable length."""
    length = random.randint(min_len, max_len)

    chars = (
        string.ascii_letters +
        string.digits +
        "!@#$%^&*()-_=+[]{}<>?"
    )

    return ''.join(random.choice(chars) for _ in range(length))

# -----------------------------------------
# FRIEND RELATIONSHIPS
# -----------------------------------------
def create_dummy_friendships(count: int = 40):
    phones = get_all_phone_numbers()
    created = 0

    for _ in range(count):
        u1, u2 = random.sample(phones, 2)

        payload = {"user_phone": u1, "friend_phone": u2}

        r = requests.post(f"{BASE_URL}/friends", params=payload)

        if r.status_code == 200:
            created += 1
        else:
            print("❌", r.status_code, r.text)

    return f"Created {created} friendships"


# -----------------------------------------
# FRIEND REQUESTS
# -----------------------------------------
def create_dummy_friend_requests(count: int = 40):
    phones = get_all_phone_numbers()
    created = 0

    for _ in range(count):
        sender, receiver = random.sample(phones, 2)

        payload = {"from_phone": sender, "to_phone": receiver}

        r = requests.post(f"{BASE_URL}/friend_requests", params=payload)

        if r.status_code == 200:
            created += 1
        else:
            print("❌", r.status_code, r.text)

    return f"Created {created} friend requests"


# -----------------------------------------
# INBOX
# -----------------------------------------
NOTIF_TYPES = [1, 2, 3, 4, 5]


def create_dummy_notifications(count: int = 50):
    phones = get_all_phone_numbers()
    created = 0

    for _ in range(count):
        sender, receiver = random.sample(phones, 2)
        notif = random.choice(NOTIF_TYPES)

        payload = {
            "notification": notif,
            "from_phone": sender,
            "to_phone": receiver,
        }

        r = requests.post(f"{BASE_URL}/inbox", params=payload)

        if r.status_code == 200:
            created += 1
        else:
            print("❌", r.status_code, r.text)

    return f"Created {created} inbox notifications"
