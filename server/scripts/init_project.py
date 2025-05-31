# terminal: PYTHONPATH=. python3 scripts/init_project.py

from src.database.relational_db import Database
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.database.models.base import Base
from src.database.models.user import UserModel

import os
from dotenv import load_dotenv
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found in .env")

db = Database(db_url=DATABASE_URL)

# drop and create categories
# if __name__ == "__main__":
#     db = Database(db_url=DATABASE_URL, verbose=True)  # 可替換為你的正式 DB

#     # 手動 drop 指定 table（順序很重要：先關聯、再主表）
#     print("🔁 Dropping tables...")
#     ProjectEditorRelation.__table__.drop(bind=db.engine, checkfirst=True)
#     ProjectMemberRelation.__table__.drop(bind=db.engine, checkfirst=True)
#     ProjectModel.__table__.drop(bind=db.engine, checkfirst=True)

#     # 然後重新建立
#     print("🛠 Creating tables...")
#     ProjectModel.__table__.create(bind=db.engine, checkfirst=True)
#     ProjectEditorRelation.__table__.create(bind=db.engine, checkfirst=True)
#     ProjectMemberRelation.__table__.create(bind=db.engine, checkfirst=True)

#     print("✅ 完成 ProjectModel 相關資料表的 reset（drop & create）")



