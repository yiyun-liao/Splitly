from pydantic import BaseModel


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