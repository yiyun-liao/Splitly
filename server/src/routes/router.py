# user_router.py
from fastapi import APIRouter, HTTPException

from src.routes.schema.user import UserSchema
from src.database.relational_db import Database
from src.database.models.user import UserModel

class Router:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db

        self._add_routes()

    def _add_routes(self):

        @self.router.get("/users/{user_id}")
        def get_user(user_id: int) -> UserSchema:
            """Get user"""
            user = self.db.get_by_id(user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            return user

        @self.router.post("/create-user")
        def create_user(user: UserSchema) -> UserSchema:
            """Create user"""
            user_instance = UserModel(**user.model_dump())
            self.db.add(user_instance)
            # self.db.session.add(user_instance)
            # self.db.session.commit()
            return user
        
        @self.router.post("/get-users")
        def get_users() -> list[UserSchema]:
            """Get users"""
            users = self.db.get_all(UserModel)
            users_schema = [UserSchema.model_validate(user, from_attributes=True) for user in users]
            return users_schema

