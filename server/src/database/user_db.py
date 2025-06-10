#server/src/database/user_db.py
from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from src.database.models.user import UserModel
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.database.models.base import Base
from src.database.relational_db import Database
from src.routes.schema.user import UserLoginSchema



class UserDB:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: UserModel) -> UserModel:
        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)  # optional, 如果要取得 id 等
            return user
        except Exception as e:
            self.db.rollback()
            print("❌ 建立使用者失敗：", str(e))
            raise HTTPException(status_code=400, detail=f"Create user failed: {str(e)}")
    
    def update_by_uid(self, uid: str ,user_data: UserLoginSchema) -> UserModel:
        user = (
            self.db.query(UserModel)
            .filter(UserModel.uid == uid)
            .first()
        )
        if not user:
            raise ValueError(f"Payment not found: {user.id}")
        
        user.name = user_data.name
        user.avatar = user_data.avatar

        try:
            self.db.commit()
            self.db.refresh(user)
            return user
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Get user by uid failed: {str(e)}")
    
    """依 uid 取得使用者"""
    def get_by_uid(self, uid: str) -> UserModel:
        try:
            user = (
                self.db.query(UserModel)
                .filter(UserModel.uid == uid)
                .first()
            )
            return user

        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Get user by uid failed: {str(e)}")
    
    """依 pid 取得 member"""
    def get_users_by_pid(self, pid) -> list[UserModel]:
        try:
            project = (
                self.db.query(ProjectModel)
                .options(
                    joinedload(ProjectModel.editors).joinedload(ProjectEditorRelation.user),
                    joinedload(ProjectModel.members).joinedload(ProjectMemberRelation.user),
                    joinedload(ProjectModel.creator)
                )
                .filter(ProjectModel.id == pid)
                .first()
            )

            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

            print(project)
            users = []

            if project.creator:
                users.append(project.creator)

            for rel in project.editors:
                if rel.user and rel.user.uid != project.creator.uid:
                    users.append(rel.user)

            for rel in project.members:
                if rel.user and rel.user.uid != project.creator.uid and rel.user not in users:
                    users.append(rel.user)

            return list(users)
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Create Project failed: {str(e)}")        
        
