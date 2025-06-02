#server/src/routes/user_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.user import UserSchema
from src.database.user_db import UserDB
from src.dependencies.database import get_db_session

class UserRouter:
    def __init__(self):
        self.router = APIRouter()
        self._add_routes()

    def _add_routes(self):
        @self.router.get("/api/getUsers/by-project", response_model=list[UserSchema])
        def get_project_users(pid: str, db: Session = Depends(get_db_session)):
            try:
                user_db = UserDB(db)
                return user_db.get_users_by_pid(pid)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch users: {str(e)}")