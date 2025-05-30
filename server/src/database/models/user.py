# server/src/database/models/user.py
from sqlalchemy import Column, Integer, String
from src.database.models.base import Base
from sqlalchemy.orm import relationship


class UserModel(Base):
    __tablename__ = "users"

    uid = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    uid_in_auth = Column(String, unique=True, nullable=False) 
    avatar = Column(Integer, nullable=False)

    created_projects = relationship("ProjectModel", back_populates="creator")
    edited_projects = relationship("ProjectEditorRelation", back_populates="user")
    joined_projects = relationship("ProjectMemberRelation", back_populates="user", cascade="all, delete")
    created_payments = relationship("PaymentModel", back_populates="creator", cascade="all, delete")
    payment_payers = relationship("PaymentPayerRelation", back_populates="user", cascade="all, delete")
    payment_splits = relationship("PaymentSplitRelation", back_populates="user", cascade="all, delete")
    item_splits = relationship("ItemSplitRelation", back_populates="user", cascade="all, delete")
