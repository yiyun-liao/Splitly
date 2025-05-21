from pydantic import BaseModel
from typing import List


class UserSchema(BaseModel):
    """Schema for user routes
    
    Args:
    name: str
    email: str
    avatar: int

    """
    name: str
    email: str
    uidInAuth: str 
    avatar: int


    model_config = {
        "from_attributes": True
    }

class UsersListSchema(BaseModel):
    """Schema for a single user."""
    users: List[UserSchema]
