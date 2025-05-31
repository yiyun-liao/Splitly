# 初始化 Firebase Admin SDK，提供 auth 功能

import firebase_admin
from firebase_admin import credentials, auth  # ← 這裡引入 auth

import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()
FIREBASE_KEY = os.getenv("FIREBASE_KEY")

print("Firebase key absolute path:", FIREBASE_KEY)

# 檔案路徑處理（可根據 main.py 的 cwd 調整）
key_path = Path(FIREBASE_KEY).resolve()
print(f"🌿 Initializing Firebase Admin SDK...")
if not firebase_admin._apps:
    cred = credentials.Certificate(str(key_path))
    firebase_admin.initialize_app(cred)

# 將 auth 匯出給其他模組使用
__all__ = ["auth"]
