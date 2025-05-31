# server/src/routes/auth_router.py
from fastapi import APIRouter, HTTPException, Request, Depends

from src.routes.schema.user import UserSchema, UserLoginSchema
from src.database.models.user import UserModel
from src.database.user_db import UserDB
from src.database.relational_db import Database
from src.dependencies.firebase import verify_firebase_token
from sqlalchemy.orm import Session


import logging
from src.firebase import firebase_admin
firebase_auth = firebase_admin.auth


class AuthRouter:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db
        self._add_routes()

    def _add_routes(self):

        @self.router.get("/api/auth/getUser", response_model=UserSchema)
        def getUser(uid: str, currentUserId: str = Depends(verify_firebase_token)):
            print(f"🚦 調用 getUser，前端傳 uid={uid}，驗證後 uid={currentUserId}")
            
            if uid != currentUserId:
                print("🚫 身份不符")
                raise HTTPException(status_code=403, detail="Unauthorized access")
            
            db_session: Session = self.db.get_session()
            user_db = UserDB(db_session)
            user = user_db.get_by_uid(uid)
            if not user:
                print("❌ 查不到 user")
                raise HTTPException(status_code=404, detail="User not found")

            print("✅ 成功取得 user，回傳資料")
            return UserSchema(
                uid=user.uid,
                email=user.email,
                name=user.name,
                uid_in_auth=user.uid_in_auth,
                avatar=user.avatar
            )


        @self.router.post("/api/auth/login")
        async def login_user(user: UserLoginSchema, uid_verified: str = Depends(verify_firebase_token)) -> dict:
            """Create user"""
            try:
                uid = uid_verified

                # 若資料庫中尚無該用戶則新增
                db_session: Session = self.db.get_session()
                user_db = UserDB(db_session)
                existing_user = user_db.get_by_uid(uid)
                if not existing_user:
                    new_user = UserModel(
                        uid=uid,  # Firebase uid 當作主鍵
                        name=user.name,
                        email=user.email,
                        uid_in_auth=user.uid_in_auth,
                        avatar=user.avatar,
                    )
                    self.db.add(new_user)

                return {"status": "success", "uid": uid}
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")
        
        @self.router.delete("/api/auth/deleteUser")
        def delete_user(uid: str, uid_verified: str = Depends(verify_firebase_token)):
            """Delete user by uid, only allow self-delete"""
            if uid != uid_verified:
                raise HTTPException(status_code=403, detail="Unauthorized")
            db_session: Session = self.db.get_session()
            user_db = UserDB(db_session)
            user = user_db.get_by_uid(uid)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            self.db.delete(user)
            return {"status": "success", "message": f"User {uid} deleted"}


