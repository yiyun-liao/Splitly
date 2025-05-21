# FastAPI 依賴注入 - 驗證 Firebase Token

from fastapi import Depends, HTTPException, Header
from firebase_admin import auth

async def verify_firebase_token(authorization: str = Header(...)):
    token = authorization.split(" ")[1]  # Bearer xxx
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="Invalid token")
        return uid
    except Exception:
        raise HTTPException(status_code=401, detail="Token verification failed")