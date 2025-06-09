#server/src/routes/user_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.user import UserSchema
from src.database.user_db import UserDB
from src.dependencies.database import get_db_session
from src.dependencies.firebase import verify_firebase_token
from src.routes.schema.user import UserSchema, UserLoginSchema, UserCreateMinimalResponse

class UserRouter:
    def __init__(self):
        self.router = APIRouter()
        self._add_routes()

    def _add_routes(self):
        # 專案的所有用戶
        @self.router.get("/api/getUsers/by-project", response_model=list[UserSchema])
        def get_project_users(pid: str, db: Session = Depends(get_db_session)):
            try:
                user_db = UserDB(db)
                return user_db.get_users_by_pid(pid)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch users: {str(e)}")
        
        
        @self.router.post("/api/auth/getUser", response_model=UserCreateMinimalResponse)
        async def update_user(
            uid:str,
            user_data: UserLoginSchema, 
            uid_verified: str = Depends(verify_firebase_token),
            db: Session = Depends(get_db_session)
        ):
            if uid != uid_verified:
                print("🚫 身份不符")
                raise HTTPException(status_code=403, detail="Unauthorized access")
            try:
                user_db = UserDB(db)
                updated_user = user_db.update_by_uid(uid, user_data)
                print("✅ 更新用戶成功:", updated_user.uid)
                return {"success": True, "user": updated_user}
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")