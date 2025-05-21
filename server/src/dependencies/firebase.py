from fastapi import Header, HTTPException
from src.firebase import firebase_admin

firebase_auth = firebase_admin.auth

def verify_firebase_token(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token  # e.g. {"uid": "...", "email": "..."}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token invalid: {str(e)}")
