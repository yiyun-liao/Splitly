# scripts/create_demo_user.py
import os, sys
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

import uuid
import firebase_admin
from firebase_admin import auth as firebase_auth
from src.database.models.user import UserModel
from src.database.relational_db import Database
from src.database.models.base import Base

from dotenv import load_dotenv
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# 只要呼叫一次就好
firebase_admin.initialize_app()

def main():
    # 1. 造 Firebase 帳號
    user_record = firebase_auth.create_user(
        email="testtest.splitly@example.com",
        password="splitly1234",
        display_name="Demo User",
    )
    print("Firebase 產生的 uid:", user_record.uid)

    # 2. 在你的 SQL DB 建對應的 UserModel
    db = Database(db_url=DATABASE_URL)
    demo = UserModel(
        uid=str(uuid.uuid4()),                   # 你自己系統的 PK
        name="Demo User",
        email="testtest.splitly@example.com",
        uid_in_auth=user_record.uid,             # Firebase UID
        avatar=1,                                 # 隨便給個預設頭像 ID
    )
    db.add(demo)
    db.commit()
    db.close()
    print("Demo 帳號已寫入 PostgreSQL users 表。")

if __name__ == "__main__":
    main()
