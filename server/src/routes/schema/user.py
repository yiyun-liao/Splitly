# server/src/routes/schema/user.py
from pydantic import BaseModel
from typing import List


class UserLoginSchema(BaseModel):
    name: str
    email: str
    uidInAuth: str
    avatar: int


class UserSchema(BaseModel):
    """Schema for user routes """
    userId: str
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
