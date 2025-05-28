# server/src/routes/schema/project.py

from pydantic import BaseModel
from typing import Optional, Dict, List, Literal
from datetime import date

class CreateProjectSchema(BaseModel):
    project_name: str
    start_time: Optional[date]
    end_time: Optional[date]
    style: Literal["travel", "daily", "other"]
    currency: str
    budget: Optional[int]
    owner: str
    editor: List[str]
    member: Optional[List[str]]
    member_budgets: Optional[Dict[str, Optional[int]]]
    desc: Optional[str]

    model_config = {
        "from_attributes": True
    }
    
class ProjectCreateMinimalResponse(BaseModel):
    success: bool
    project_name: str