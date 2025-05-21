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

        @self.router.get("/api/auth/getUser")
        def get_user(userId: str, token_data: dict = Depends(verify_firebase_token)) -> UserSchema:
            """Get user by uid with token verification"""
            try:
                # 確保只查詢登入者自己的資料
                if userId != token_data["uid"]:
                    raise HTTPException(status_code=403, detail="Unauthorized access")

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
        async def login_user(request: Request, user: UserSchema)  -> dict:
            """Create user"""
            print("✅ 收到使用者資料：", user)
            auth_header = request.headers.get("Authorization")
            print("🔎 Authorization Header:", auth_header)
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="No token provided")
            token = auth_header.split(" ")[1]

            try:
                decoded_token = firebase_auth.verify_id_token(token)
                print("🧾 解碼結果：", decoded_token)
                uid = decoded_token["uid"]
                body = await request.json()
                name = body["name"]
                email = body["email"]
                uid_in_auth = body["uidInAuth"]
                avatar = body["avatar"]

                # 若資料庫中尚無該用戶則新增
                existing_user = self.db.session.query(UserModel).filter_by(uid=uid).first()
                if not existing_user:
                    user = UserModel(
                        uid=uid,  # Firebase uid 當作主鍵
                        name=name,
                        email=email,
                        uid_in_auth=uid_in_auth,
                        avatar=avatar,
                    )
                    self.db.add(user)

                return {"status": "success", "uid": uid}
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")
        
        @self.router.post("/api/auth/get-users")
        def get_users(request: Request) -> list[UserSchema]:
            """Get users"""
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="No token provided")
            users = self.db.get_all(UserModel)
            users_schema = [UserSchema.model_validate(user, from_attributes=True) for user in users]
            return users_schema

