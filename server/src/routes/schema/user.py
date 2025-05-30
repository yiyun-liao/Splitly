# server/src/routes/schema/user.py
from pydantic import BaseModel
from typing import List


class UserLoginSchema(BaseModel):
    name: str
    email: str
    uid_in_auth: str
    avatar: int


class UserSchema(BaseModel):
    """Schema for user routes """
    uid: str
    name: str
    email: str
    uid_in_auth: str 
    avatar: int

    model_config = {
        "from_attributes": True
    }


class UsersListSchema(BaseModel):
    """Schema for a single user."""
    users: List[UserSchema]
