# user_router.py
from fastapi import APIRouter, HTTPException, Request, Depends

from src.routes.schema.user import UserSchema
from src.database.relational_db import Database
from src.database.models.user import UserModel
from src.dependencies.firebase import verify_firebase_token

from src.firebase import firebase_admin
firebase_auth = firebase_admin.auth



class Router:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db
        self._add_routes()

    def _add_routes(self):

        @self.router.get("/api/auth/getUser", response_model=UserSchema)
        def getUser(userId: str, uid_verified: str = Depends(verify_firebase_token)):
            """Get user by uid with token verification"""
            # 確保只查詢登入者自己的資料
            if userId != uid_verified:
                raise HTTPException(status_code=403, detail="Unauthorized access")
            
            try:
                user = self.db.session.query(UserModel).filter_by(uid=userId).first()
                if not user:
                    raise HTTPException(status_code=404, detail="User not found")

                return UserSchema(
                    userId=user.uid,
                    email=user.email,
                    name=user.name,
                    uidInAuth=user.uid_in_auth,
                    avatar=user.avatar
                )
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")

        @self.router.post("/api/auth/login")
        async def login_user(user: UserSchema, uid_verified: str = Depends(verify_firebase_token)) -> dict:
            """Create user"""
            try:
                uid = uid_verified

                # 若資料庫中尚無該用戶則新增
                existing_user = self.db.session.query(UserModel).filter_by(uid=uid).first()
                if not existing_user:
                    new_user = UserModel(
                        uid=uid,  # Firebase uid 當作主鍵
                        name=user.name,
                        email=user.email,
                        uid_in_auth=user.uidInAuth,
                        avatar=user.avatar,
                    )
                    self.db.add(new_user)

                return {"status": "success", "uid": uid}
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")
        
        @self.router.get("/api/auth/getUsers", response_model=list[UserSchema])
        def getUsers(uid_verified: str = Depends(verify_firebase_token)):
            """Get all users (requires login)"""
            users = self.db.get_all(UserModel)
            users_schema = [UserSchema.model_validate(user, from_attributes=True) for user in users]
            return users_schema
        
        @self.router.delete("/api/auth/deleteUser")
        def delete_user(uid: str, uid_verified: str = Depends(verify_firebase_token)):
            """Delete user by uid, only allow self-delete"""
            if uid != uid_verified:
                raise HTTPException(status_code=403, detail="Unauthorized")

            user = self.db.session.query(UserModel).filter_by(uid=uid).first()
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            self.db.session.delete(user)
            self.db.session.commit()
            return {"status": "success", "message": f"User {uid} deleted"}


