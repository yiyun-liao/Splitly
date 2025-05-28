#server/src/database/project_db.py
from sqlalchemy.orm import Session
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.routes.schema.project import CreateProjectSchema
from fastapi import HTTPException
from uuid import uuid4


class ProjectDB:
    def __init__(self, db: Session):
        self.db = db

    def create_project(self, project_data: CreateProjectSchema):
        project = ProjectModel(
            id=str(uuid4()),
            project_name=project_data.project_name,
            start_time=project_data.start_time,
            end_time=project_data.end_time,
            style=project_data.style,
            currency=project_data.currency,
            budget=project_data.budget,
            owner=project_data.owner,  
            member_budgets=project_data.member_budgets,
            desc=project_data.desc,
        )
        self.db.add(project)

        # 加入 editor 關聯
        for uid in project_data.editor:
            self.db.add(ProjectEditorRelation(project_id=project.id, user_id=uid))

        # 加入 member 關聯（如果有）
        if project_data.member:
            for uid in project_data.member:
                self.db.add(ProjectMemberRelation(project_id=project.id, user_id=uid))

        try:
            self.db.commit()
            self.db.refresh(project)
            return project
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Create Project failed: {str(e)}")
