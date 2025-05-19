from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, DateTime, func

class BaseModel:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

Base = declarative_base(cls=BaseModel)
