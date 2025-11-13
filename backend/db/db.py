import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

metadata = MetaData()
Base = declarative_base()
load_dotenv()

def db_connect():
    
    username = os.environ.get("DATABASE_USERNAME")
    password = os.environ.get("DATABASE_PASSWORD")
    dbname = os.environ.get("DATABASE_NAME")
    port = os.environ.get("DATABASE_PORT")
    host = os.environ.get("DATABASE_HOST")
    engine = create_engine(f"{dbname}://{host}:{password}@aws-1-us-east-2.pooler.supabase.com:{port}/{username}", echo=True)
    connection = engine.connect()

    return engine, connection

def create_tables_orm(engine):
    Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)

def create_session(engine):
    Session = sessionmaker(bind=engine)
    session = Session()

    return session