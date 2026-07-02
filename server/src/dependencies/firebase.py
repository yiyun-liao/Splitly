# FastAPI 依賴注入 - 驗證 Firebase Token

from fastapi import Depends, HTTPException, Header
from firebase_admin import auth

async def verify_firebase_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token header")

    token = authorization.split(" ")[1]
    if not token:
        raise HTTPException(status_code=401, detail="Token is empty")

    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="UID missing in token")
        return uid
    except HTTPException:
        raise
    except Exception as e:
        print("❌ Token verification error:", str(e))
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")