# server/src/routes/auth_router.py
from fastapi import APIRouter, HTTPException, Request, Depends
from sqlalchemy.orm import Session

from src.routes.schema.user import UserSchema, UserLoginSchema, UserCreateMinimalResponse
from src.database.models.user import UserModel
from src.database.user_db import UserDB
from src.dependencies.firebase import verify_firebase_token
from src.dependencies.database import get_db_session

from src.firebase import firebase_admin
firebase_auth = firebase_admin.auth


class AuthRouter:
    def __init__(self):
        self.router = APIRouter()
        self._add_routes()

    def _add_routes(self):

        @self.router.get("/api/auth/user", response_model=UserSchema)
        def getUser(
            uid: str, 
            currentUserId: str = Depends(verify_firebase_token),
            db: Session = Depends(get_db_session)
        ):
            print(f"🚦 調用 getUser，前端傳 uid={uid}，驗證後 uid={currentUserId}")
            
            if uid != currentUserId:
                print("🚫 身份不符")
                raise HTTPException(status_code=403, detail="Unauthorized access")
            
            user_db = UserDB(db)
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
        async def login_user(
            user: UserLoginSchema, 
            uid_verified: str = Depends(verify_firebase_token),
            db: Session = Depends(get_db_session)
        ) -> UserCreateMinimalResponse:
            """Create user"""
            try:
                uid = uid_verified
                user_db = UserDB(db)

                existing_user = user_db.get_by_uid(uid)
                if not existing_user:
                    new_user = UserModel(
                        uid=uid,  # Firebase uid 當作主鍵
                        name=user.name,
                        email=user.email,
                        uid_in_auth=user.uid_in_auth,
                        avatar=user.avatar,
                    )
                    user_db.create_user(new_user)
                    print("👻 新用戶建立", new_user)

                print("✅ 成功取得 uid:", uid)
                return {"success": True, "uid": uid}
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")
        
        # @self.router.delete("/api/auth/deleteUser")
        # def delete_user(
        #     uid: str, 
        #     uid_verified: str = Depends(verify_firebase_token),
        #     db: Session = Depends(get_db_session)
        # ):
        #     """Delete user by uid, only allow self-delete"""
        #     if uid != uid_verified:
        #         raise HTTPException(status_code=403, detail="Unauthorized")
            
        #     user_db = UserDB(db)
        #     user = user_db.get_by_uid(uid)

        #     if not user:
        #         raise HTTPException(status_code=404, detail="User not found")

        #     # 移到 user_db 中做
        #     try:
        #         db.delete(user)
        #         db.commit()
        #         return {"status": "success", "message": f"User {uid} deleted"}
        #     except Exception as e:
        #         db.rollback()
        #         raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")


