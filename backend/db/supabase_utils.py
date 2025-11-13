import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def supabase_health_test():
    """Make sure that it doesn't error with your current config"""
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    assert url and key, "Missing SUPABASE_URL or SUPABASE_KEY"
    supabase: Client = create_client(supabase_url=url, supabase_key=key)
    return supabase.functions_url