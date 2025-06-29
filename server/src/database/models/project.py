# server/src/database/models/project.py
from sqlalchemy import Column, String, Integer, Date, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import ARRAY
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
    project_name = Column(String, nullable=False)
    start_time = Column(Date, nullable=True)
    end_time = Column(Date, nullable=True)
    style = Column(Enum(ProjectStyleEnum), nullable=False)
    currency = Column(String, nullable=False)
    budget = Column(Integer, nullable=True)

    owner = Column(String, ForeignKey("users.uid", ondelete="CASCADE"), nullable=False, index=True)  # FK

    member_budgets = Column(JSON, nullable=True)  # { uid: 1000 }
    desc = Column(String, nullable=True)
    img = Column(Integer, nullable=False)
    
    creator = relationship("UserModel", back_populates="created_projects", foreign_keys=[owner])
    editors = relationship("ProjectEditorRelation", back_populates="project", cascade="all, delete-orphan")
    members = relationship("ProjectMemberRelation", back_populates="project", cascade="all, delete-orphan")


# Editor 關聯
class ProjectEditorRelation(Base):
    __tablename__ = "project_editors"
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.uid", ondelete="CASCADE"), primary_key=True, index=True)

    user = relationship("UserModel", back_populates="edited_projects")
    project = relationship("ProjectModel", back_populates="editors")

# Member 關聯
class ProjectMemberRelation(Base):
    __tablename__ = "project_members"
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.uid", ondelete="CASCADE"), primary_key=True, index=True)

    user = relationship("UserModel", back_populates="joined_projects")
    project = relationship("ProjectModel", back_populates="members")