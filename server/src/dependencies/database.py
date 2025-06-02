# server/src/dependencies/database.py
from sqlalchemy.orm import Session
from src.database.relational_db import SessionLocal

def get_db_session():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
