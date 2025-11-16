# Backend
This is the FastAPI Server. To interact with the DB or any APIs you need this running.

```bash
# make sure to run "chmod +x ./run.sh if your get 'permission denied'
./start.sh
```

## Setup

### Virtual Environment
Where all your `pip install`'s will be writing to. The `requirements.txt` tells you what needs to be in here.

```bash
# make sure that your conda environment is off already (conda deactivate)
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