# server/src/routes/schema/category.py

from pydantic import BaseModel
from typing import List, Optional, ForwardRef

# 為了支援自己引用自己
CategoryOutSchema = ForwardRef("CategoryOutSchema")

class CategorySchema(BaseModel):
    """Schema for category routes
    
    Args:
    name: str
    parent_id:int
    """
    name: str
    parent_id: Optional[int] = None

    model_config = {
        "from_attributes": True
    }

class CategoryOutSchema(CategorySchema):
    """Response schema for returning a category with ID."""
    id: int
    children: Optional[List["CategoryOutSchema"]] = None

    model_config = {
        "from_attributes": True
    }

CategoryOutSchema.model_rebuild()

