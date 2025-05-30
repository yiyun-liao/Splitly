# server/src/routes/schema/category.py
from pydantic import BaseModel
from typing import List, Optional, ForwardRef

class CategorySchema(BaseModel):
    """Schema for creating or updating a category"""
    name_en: str
    name_zh: str
    parent_id: Optional[int] = None

    model_config = {
        "from_attributes": True
    }


# 為了支援自己引用自己
CategoryOutSchema = ForwardRef("CategoryOutSchema")

class CategoryOutSchema(CategorySchema):
    """Response schema with ID and nested children"""
    id: int
    children: Optional[List["CategoryOutSchema"]] = None  # 支援巢狀回傳

    model_config = {
        "from_attributes": True
    }


# 解決 ForwardRef 的遞迴引用
CategoryOutSchema.model_rebuild()
