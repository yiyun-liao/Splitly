from pydantic import BaseModel
from typing import List, Optional

class CategorySchema(BaseModel):
    """Schema for category routes
    
    Args:
    name: str
    parent_id:int
    """
    name: str
    parent_id: Optional[int] = None

class CategoryCreateSchema(CategorySchema):
    pass

class CategoryOutSchema(CategorySchema):
    id: int

    class Config:
        orm_mode = True

# class CategoriesListSchema(BaseModel):
#     """Schema for a single user."""
#     categories: List[CategorySchema]