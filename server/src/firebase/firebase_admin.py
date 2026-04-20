# 初始化 Firebase Admin SDK，提供 auth 功能

import firebase_admin
from firebase_admin import credentials, auth

import os
import json
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

print(f"🌿 Initializing Firebase Admin SDK...")

if not firebase_admin._apps:
    # Render 部署：從環境變數讀取 JSON 內容
    firebase_credentials_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
    if firebase_credentials_json:
        cred_dict = json.loads(firebase_credentials_json)
        cred = credentials.Certificate(cred_dict)
        print("✅ Using FIREBASE_CREDENTIALS_JSON env var")
    else:
        # 本地開發：從檔案路徑讀取
        FIREBASE_KEY = os.getenv("FIREBASE_KEY")
        print("✅ FIREBASE_KEY path from .env:", FIREBASE_KEY)
        key_path = Path(FIREBASE_KEY).resolve()
        cred = credentials.Certificate(str(key_path))

    firebase_admin.initialize_app(cred)
    print("🎉 Firebase Admin SDK initialized successfully!")

__all__ = ["auth"]
