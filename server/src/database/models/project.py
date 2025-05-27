from sqlalchemy import Column, String, Integer, Date, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from src.database.models.base import Base
import enum

class ProjectStyleEnum(str, enum.Enum):
    travel = "travel"
    daily = "daily"
    other = "other"

class ProjectModel(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, index=True)
    created_by = Column(String, ForeignKey("users.uid"), nullable=False)
    creator = relationship("UserModel", back_populates="projects_created")

    project_name = Column(String, nullable=False)
    start_time = Column(Date, nullable=True)
    end_time = Column(Date, nullable=True)
    style = Column(Enum(ProjectStyleEnum), nullable=False)
    currency = Column(String, nullable=False)
    budget = Column(Integer, nullable=True)
    member_list = Column(JSONB, nullable=True)  # e.g. { "owner": "uid" }
    member_budgets = Column(JSONB, nullable=True)  # e.g. { "uid1": 500 }
    desc = Column(String, nullable=True)
