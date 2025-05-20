from sqlalchemy import Column, Integer, String
from src.database.models.base import Base

class UserModel(Base):
    __tablename__ = "users"

    uid = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    uid_in_auth = Column(String, unique=True, nullable=False) 
    avatar = Column(Integer, nullable=False)