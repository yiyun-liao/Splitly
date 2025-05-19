from pydantic import BaseModel


class UserSchema(BaseModel):
    """Schema for user routes
    
    Args:
    name: str
    email: str
    """
    name: str
    email: str


    model_config = {
        "from_attributes": True
    }