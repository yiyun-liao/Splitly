#server/src/database/project_db.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.routes.schema.project import CreateProjectSchema
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime


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
            img=project_data.img
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


    def get_projects_by_user_id(self, uid):
        try:
            # owner
            owner_projects = self.db.query(ProjectModel).filter(
                and_(
                    ProjectModel.owner == uid,
                    ProjectModel.deleted_at.is_(None)
                )
            )
            # editor
            editor_project_ids = self.db.query(ProjectEditorRelation.project_id).filter(
                ProjectEditorRelation.user_id == uid
            ).subquery()

            editor_projects = self.db.query(ProjectModel).filter(
                and_(
                    ProjectModel.id.in_(editor_project_ids),
                    ProjectModel.deleted_at.is_(None)
                )
            )
            # member
            member_project_ids = self.db.query(ProjectMemberRelation.project_id).filter(
                ProjectMemberRelation.user_id == uid
            ).subquery()

            member_projects = self.db.query(ProjectModel).filter(
                and_(
                    ProjectModel.id.in_(member_project_ids),
                    ProjectModel.deleted_at.is_(None)
                )
            )

            return owner_projects.union(editor_projects).union(member_projects).all()
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Create Project failed: {str(e)}")        

    # soft delete
    def delete_project(self, project_id: str):
        project = self.db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        project.deleted_at = datetime.now()
        self.db.commit()



    # delete
    # def delete_project(self, project_id: str):
    #     # 查詢主專案
    #     project = self.db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    #     if not project:
    #         raise HTTPException(status_code=404, detail="Project not found")
    #     # 刪除 editor 關聯
    #     self.db.query(ProjectEditorRelation).filter_by(project_id=project_id).delete()
    #     # 刪除 member 關聯
    #     self.db.query(ProjectMemberRelation).filter_by(project_id=project_id).delete()
    #     # 刪除專案本體
    #     self.db.delete(project)
    #     self.db.commit()