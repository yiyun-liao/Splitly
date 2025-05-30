#server/src/database/user_db.py
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.database.models.user import UserModel
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.database.models.base import Base
from sqlalchemy.orm import joinedload



class UserDB:
    def __init__(self, db: Session):
        self.db = db

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