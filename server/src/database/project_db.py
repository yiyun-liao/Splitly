#server/src/database/project_db.py
from sqlalchemy.orm import Session
from sqlalchemy import and_
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.routes.schema.project import CreateProjectSchema, GetProjectSchema, UpdateProjectSchema,JoinProjectSchema
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime


class ProjectDB:
    def __init__(self, db: Session):
        self.db = db

    def create_project_db(self, project_data: CreateProjectSchema):
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

    def get_certain_project_db(self, pid: str) -> GetProjectSchema:
        project = self.db.query(ProjectModel).filter(ProjectModel.id == pid).first()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

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

        return GetProjectSchema(
            id=project.id,
            project_name=project.project_name,
            start_time=project.start_time,
            end_time=project.end_time,
            style=project.style,
            currency=project.currency,
            budget=project.budget,
            owner=project.owner,
            member_budgets=project.member_budgets or {},
            desc=project.desc,
            img=project.img,
            editor=editor_uids,
            member=member_uids,
        )

    def update_project_db(self, pid: str, payload: UpdateProjectSchema) -> GetProjectSchema:
        project = self.db.query(ProjectModel).filter(ProjectModel.id == pid).first()

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 更新基本欄位
        for field in [
            "project_name", "start_time", "end_time", "style",
            "currency", "budget", "desc", "img", "member_budgets"
        ]:
            val = getattr(payload, field)
            if val is not None:
                setattr(project, field, val)

        # 更新 editor 關聯（全刪重加）
        if payload.editor is not None:
            self.db.query(ProjectEditorRelation).filter_by(project_id=pid).delete()
            for uid in payload.editor:
                self.db.add(ProjectEditorRelation(project_id=pid, user_id=uid))

        # 更新 member 關聯（全刪重加）
        if payload.member is not None:
            self.db.query(ProjectMemberRelation).filter_by(project_id=pid).delete()
            for uid in payload.member:
                self.db.add(ProjectMemberRelation(project_id=pid, user_id=uid))

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
                member_budgets=project.member_budgets or {},
                desc=project.desc,
                img=project.img,
                editor=payload.editor or [],
                member=payload.member or [],
            )
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Update project failed: {str(e)}")

    # add member
    def join_project_db(self, pid: str, payload: JoinProjectSchema)-> GetProjectSchema:
        # 查找專案
        project: ProjectModel = self.db.query(ProjectModel).filter(ProjectModel.id == pid).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 取得新加入的成員 uid
        new_member_uid = payload.member

        # 檢查是否已存在關聯
        existing_relation = self.db.query(ProjectMemberRelation).filter_by(
            project_id=pid, user_id=new_member_uid
        ).first()
        if existing_relation:
            raise HTTPException(status_code=400, detail="Member already joined the project")

        # 加入 member 關聯
        self.db.add(ProjectMemberRelation(project_id=pid, user_id=new_member_uid))

        # 加入 budget（如果有提供）
        if payload.member_budgets and new_member_uid in payload.member_budgets:
            member_budget = payload.member_budgets.get(new_member_uid)
            if member_budget is not None:
                project.member_budgets = {
                    **(project.member_budgets or {}),
                    new_member_uid: member_budget
                }

        try:
            self.db.commit()
            self.db.refresh(project)

            # 整理出所有 member
            member_relations = self.db.query(ProjectMemberRelation).filter_by(project_id=pid).all()
            member_uids = [rel.user_id for rel in member_relations]

            # 整理出所有 editor
            editor_relations = self.db.query(ProjectEditorRelation).filter_by(project_id=pid).all()
            editor_uids = [rel.user_id for rel in editor_relations]

            return GetProjectSchema(
                id=project.id,
                project_name=project.project_name,
                start_time=project.start_time,
                end_time=project.end_time,
                style=project.style,
                currency=project.currency,
                budget=project.budget,
                owner=project.owner,
                editor=editor_uids,
                member=member_uids,
                member_budgets=project.member_budgets,
                desc=project.desc,
                img=project.img
            )

        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Join project failed: {str(e)}")

    def get_projects_by_user_id_db(self, uid):
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
            allData = owner_projects.union_all(editor_projects).union_all(member_projects).all()

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
  
    # soft delete
    def delete_project_db(self, pid: str):
        project = self.db.query(ProjectModel).filter(ProjectModel.id == pid).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        project.deleted_at = datetime.now()
        self.db.commit()



    # delete
    def delete_project(self, project_id: str):
        # 查詢主專案
        project = self.db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        # 刪除 editor 關聯
        self.db.query(ProjectEditorRelation).filter_by(project_id=project_id).delete()
        # 刪除 member 關聯
        self.db.query(ProjectMemberRelation).filter_by(project_id=project_id).delete()
        # 刪除專案本體
        self.db.delete(project)
        self.db.commit()