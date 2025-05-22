# server/src/database/models/category.py
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from src.database.models.base import Base

class CategoryModel(Base):
    __tablename__ = "categories"

    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

    parent = relationship("CategoryModel", remote_side=[id], backref="children")

    __table_args__ = (
        UniqueConstraint("name", "parent_id", name="uq_category_name_parent"),
    )
