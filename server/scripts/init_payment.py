# # terminal: PYTHONPATH=. python3 scripts/init_payment.py

# from src.database.relational_db import Database
# from src.database.models.base import Base
# from src.database.models.user import UserModel
# from src.database.models.project import ProjectModel
# from sqlalchemy import create_engine
# from src.database.models.payment import (
#     PaymentModel,
#     PaymentPayerRelation,
#     PaymentSplitRelation,
#     ItemModel,
#     ItemSplitRelation
# )

# from dotenv import load_dotenv
# load_dotenv()
# DATABASE_URL = os.getenv("DATABASE_URL")
# if not DATABASE_URL:
#     raise RuntimeError("DATABASE_URL not found in .env")

# if __name__ == "__main__":
#     db = Database(db_url=DATABASE_URL, verbose=True)  

#     # 手動 drop 指定 table（順序很重要：先關聯、再主表）
#     print("🔁 Dropping tables...")
#     ItemSplitRelation.__table__.drop(bind=db.engine, checkfirst=True)
#     ItemModel.__table__.drop(bind=db.engine, checkfirst=True)
#     PaymentSplitRelation.__table__.drop(bind=db.engine, checkfirst=True)
#     PaymentPayerRelation.__table__.drop(bind=db.engine, checkfirst=True)
#     PaymentModel.__table__.drop(bind=db.engine, checkfirst=True)

#     print("✅ 完成 PaymentModel 相關資料表 drop ")



