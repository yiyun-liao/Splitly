#server/src/routes/user_router.py
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.user import UserSchema
from src.database.user_db import UserDB
from src.database.relational_db import Database



class UserRouter:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db
        self._add_routes()

    def _add_routes(self):
        @self.router.get("/api/getUsers/by-project", response_model=list[UserSchema])
        def get_project_users(pid: str):
            try:
                db_session: Session = self.db.get_session()
                user_db = UserDB(db_session)
                users = user_db.get_users_by_pid(pid)
                return users
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch users: {str(e)}")
