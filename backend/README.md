# Backend
This is the FastAPI Server. To interact with the DB or any APIs you need this running.

```bash
uvicorn main:app --reload
```

## Setup

### Virtual Environment
Where all your `pip install`'s will be writing to. The `requirements.txt` tells you what needs to be in here.

```bash
python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
```

### .env
This stores all of the secrets used in the code, like DB url.

```bash
cp .env.example .env
```

Then fill in the secrets yourself