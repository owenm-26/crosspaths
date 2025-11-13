from sqlalchemy import Column, Integer, Text, func, distinct
from .db import db_connect, create_session, Base, create_tables_orm

engine, connection = db_connect()
session = create_session(engine)