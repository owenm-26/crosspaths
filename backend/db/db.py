import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
from sqlalchemy.orm import Session

metadata = MetaData()
Base = declarative_base()
load_dotenv()

def db_connect():
    # Construct the SQLAlchemy connection string
    DATABASE_URL = os.getenv("DATABASE_URL")

    # Create the SQLAlchemy engine
    engine = create_engine(DATABASE_URL)
    # If using Transaction Pooler or Session Pooler, we want to ensure we disable SQLAlchemy client side pooling -
    # https://docs.sqlalchemy.org/en/20/core/pooling.html#switching-pool-implementations
    # engine = create_engine(DATABASE_URL, poolclass=NullPool)

    # Test the connection
    try:
        with engine.connect() as connection:
            print("Connection successful!")
    except Exception as e:
        print(f"Failed to connect: {e}")
    
    return engine

def create_tables_orm(engine):
    Base.metadata.drop_all(engine, checkfirst=True)
    Base.metadata.create_all(engine, checkfirst=True)

def create_session(engine):
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = Session()

    return session

# Dependency to get a DB session
def get_db():
    # try:
    yield db_session
    # finally:
        # db_session.close()

engine = db_connect()
db_session: Session = create_session(engine=engine)