# FastAPI 依賴注入 - 驗證 Firebase Token

from fastapi import Depends, HTTPException, Header
from firebase_admin import auth

async def verify_firebase_token(authorization: str = Header(...)):
    print("🔥 Authorization Header:", authorization)
    token = authorization.split(" ")[1]  # Bearer xxx
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token header")

        token = authorization.split(" ")[1]
        print("🔥 Extracted token:", token[:20], "...")  # print 前20碼方便 debug

        decoded_token = auth.verify_id_token(token)
        # print("✅ Decoded token:", decoded_token)

        uid = decoded_token.get("uid")
        if not uid:
            raise HTTPException(status_code=401, detail="UID missing in token")
        return uid
    except Exception as e:
        print("❌ Token verification error:", str(e))
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")