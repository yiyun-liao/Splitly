# server/src/database/models/category.py
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from src.database.models.base import Base

class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name_en = Column(String, nullable=False)
    name_zh = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    parent = relationship("CategoryModel", remote_side=[id], back_populates="children")
    children = relationship("CategoryModel", back_populates="parent", cascade="all, delete")
    payments = relationship("PaymentModel", back_populates="category", cascade="all, delete")


    __table_args__ = (
        UniqueConstraint("name_en", "parent_id", name="uq_category_name_en_parent"),
    )
