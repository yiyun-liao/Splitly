# server/src/routes/schema/project.py

from pydantic import BaseModel
from typing import Optional, Dict, List, Literal
from datetime import date

class CreateProjectSchema(BaseModel):
    project_name: str
    start_time: Optional[date]  = None
    end_time: Optional[date]  = None
    style: Literal["travel", "daily", "other"]
    currency: str
    budget: Optional[int]  = None
    owner: str
    editor: List[str] 
    member: Optional[List[str]]  = None
    member_budgets: Optional[Dict[str, Optional[int]]]  = None
    desc: Optional[str]  = None
    img: int


    model_config = {
        "from_attributes": True
    }

class GetProjectSchema(CreateProjectSchema):
    id:str

class AddProjectMembersSchema(BaseModel):
    member: List[str]
    # 要有 member_budgets

# 更新用（所有欄位選填）
class UpdateProjectSchema(BaseModel):
    id:str
    project_name: Optional[str]  = None
    start_time: Optional[date]  = None
    end_time: Optional[date]  = None
    style: Optional[Literal["travel", "daily", "other"]]  = None
    currency: Optional[str]  = None
    budget: Optional[int]  = None
    owner: Optional[str] = None
    editor: Optional[List[str]] =None
    member: Optional[List[str]]  = None
    member_budgets: Optional[Dict[str, Optional[int]]]  = None
    img: Optional[int]  = None
    desc: Optional[str]  = None

class JoinProjectSchema(BaseModel):
    id:str
    member: str
    member_budgets: Optional[Dict[str, Optional[int]]]  = None


# response
class ProjectCreateMinimalResponse(BaseModel):
    success: bool
    project: Optional[GetProjectSchema] = None
    project_name: Optional[str]  = None
    member: Optional[List[str]]  = None
    message: Optional[str] = None


