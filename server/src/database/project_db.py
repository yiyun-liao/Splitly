#server/src/database/project_db.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.routes.schema.project import CreateProjectSchema, GetProjectSchema
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
            return GetProjectSchema(
                id=project.id,
                project_name=project.project_name,
                start_time=project.start_time,
                end_time=project.end_time,
                style=project.style,
                currency=project.currency,
                budget=project.budget,
                owner=project.owner,
                editor=project_data.editor,  # 直接用原始傳入值
                member=project_data.member,
                member_budgets=project.member_budgets,
                desc=project.desc,
                img=project.img
            )
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
            allData = owner_projects.union(editor_projects).union(member_projects).all()

            result = []
            for project in allData:
                # 查出 editors
                editor_uids = [
                    rel.user_id for rel in self.db.query(ProjectEditorRelation)
                    .filter_by(project_id=project.id)
                    .all()
                ]
                # 查出 members
                member_uids = [
                    rel.user_id for rel in self.db.query(ProjectMemberRelation)
                    .filter_by(project_id=project.id)
                    .all()
                ]
                result.append(GetProjectSchema(
                    id=project.id,
                    project_name=project.project_name,
                    start_time=project.start_time,
                    end_time=project.end_time,
                    style=project.style,
                    currency=project.currency,
                    budget=project.budget,
                    owner=project.owner,
                    member_budgets=project.member_budgets or {},
                    img=project.img,
                    desc=project.desc,
                    editor=editor_uids,
                    member=member_uids
                ))
            
            return result
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Create Project failed: {str(e)}")        

    # add member
    def add_members_to_project(self, project_id: str, member: list[str]):
        # 1. 確保專案存在
        try:
            project = self.db.query(ProjectModel).filter_by(id=project_id).first()
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

            # 2. 過濾出尚未存在的 user_ids
            existing = self.db.query(ProjectMemberRelation.user_id).filter_by(project_id=project_id).all()
            existing_user_ids = {row[0] for row in existing}
            new_user_ids = [uid for uid in member if uid not in existing_user_ids]

            # 3. 建立新關聯
            for uid in new_user_ids:
                relation = ProjectMemberRelation(project_id=project_id, user_id=uid)
                self.db.add(relation)

            self.db.commit()
            return new_user_ids  # 回傳成功新增的 uid
        
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Add member failed: {str(e)}")     
    
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