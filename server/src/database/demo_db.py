#server/src/database/demo_db.py
from fastapi import HTTPException
from uuid import uuid4
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, text
from src.database.models.user import UserModel
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.database.models.payment import PaymentModel, PaymentPayerRelation, PaymentSplitRelation, ItemModel, ItemSplitRelation
from src.database.models.category import CategoryModel
from src.database.models.base import Base
from datetime import datetime, date

import json
from pathlib import Path

# 找到 demo_data.json 的绝对路径
HERE = Path(__file__).parent.parent.parent / "scripts"
DATA_PATH = HERE / "demo_data.json"

with DATA_PATH.open(encoding="utf-8") as f:
    demo_data = json.load(f)

CATEGORIES_WITH_IDS = [
    # Food & Drink (parent_id=46, children 47-54)
    (46, "Food & Drink", "飲食", None),
    (47, "Breakfast", "早餐", 46),
    (48, "Lunch", "午餐", 46),
    (49, "Dinner", "晚餐", 46),
    (50, "Snacks", "點心", 46),
    (51, "Groceries", "雜貨食品", 46),
    (52, "Drinks", "飲料", 46),
    (53, "Alcohol", "酒類", 46),
    (54, "Others", "其他", 46),
    # Shopping (parent_id=55, children 56-64)
    (55, "Shopping", "購物", None),
    (56, "Clothing", "衣物", 55),
    (57, "Shoes", "鞋子", 55),
    (58, "Accessories", "配件", 55),
    (59, "Bags", "包包", 55),
    (60, "Beauty", "美妝保養", 55),
    (61, "Luxury", "精品", 55),
    (62, "Gifts", "禮物", 55),
    (63, "Electronics", "電子產品", 55),
    (64, "Others", "其他", 55),
    # Transport & Stay (parent_id=65, children 66-75)
    (65, "Transport & Stay", "交通及住宿", None),
    (66, "Hotel", "住宿", 65),
    (67, "Gas", "加油", 65),
    (68, "Parking", "停車", 65),
    (69, "Rental", "租車", 65),
    (70, "Train", "火車", 65),
    (71, "Taxi", "計程車", 65),
    (72, "Flight", "機票", 65),
    (73, "Boat", "船票", 65),
    (74, "Insurance", "保險", 65),
    (75, "Others", "其他", 65),
    # Home (parent_id=76, children 77-89)
    (76, "Home", "家居", None),
    (77, "Furniture", "家具", 76),
    (78, "Supplies", "日常用品", 76),
    (79, "Electricity", "電費", 76),
    (80, "Water", "水費", 76),
    (81, "Gas", "瓦斯費", 76),
    (82, "Rent", "房租", 76),
    (83, "Laundry", "洗衣費", 76),
    (84, "Repair", "修繕費", 76),
    (85, "Subscription", "訂閱", 76),
    (86, "Internet", "網路費", 76),
    (87, "Phone", "電話費", 76),
    (88, "Cleaning", "清潔費用", 76),
    (89, "Others", "其他", 76),
    # Entertainment (parent_id=90, children 91-100)
    (90, "Entertainment", "娛樂", None),
    (91, "Games", "遊戲", 90),
    (92, "Salon", "美容", 90),
    (93, "Theme Park", "遊樂園", 90),
    (94, "Exhibition", "展覽", 90),
    (95, "Movie", "電影", 90),
    (96, "Music", "音樂", 90),
    (97, "Sports", "運動", 90),
    (98, "Party", "派對", 90),
    (99, "Massage", "按摩", 90),
    (100, "Others", "其他", 90),
    # Special category for debt/transfer
    (101, "Debt", "債務", None),
]

# 拆解
demo_user_payload    = demo_data["userData"]
demo_project_payload = demo_data["project"]
demo_payments        = demo_data["payment"]["payments"]


class DemoDB:
    def __init__(self, db: Session):
        self.db = db

    def seed_categories_if_empty(self):
        count = self.db.query(CategoryModel).count()
        if count > 0:
            return
        for cat_id, name_en, name_zh, parent_id in CATEGORIES_WITH_IDS:
            self.db.add(CategoryModel(id=cat_id, name_en=name_en, name_zh=name_zh, parent_id=parent_id))
        self.db.flush()
        # Update PostgreSQL sequence to avoid ID conflicts for future inserts
        self.db.execute(
            text("SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))")
        )
        self.db.flush()
        print("🎉 Categories seeded with explicit IDs")

    def refresh_demo_all(self, uid: str, pid:str):
        self.seed_categories_if_empty()
        # ——— 刪除其他專案（除了 pid） ———
        other_projects = (
            self.db.query(ProjectModel)
                .filter(ProjectModel.id != pid)
                .filter(
                    or_(
                        ProjectModel.owner == uid,
                        ProjectModel.editors.any(ProjectEditorRelation.user_id == uid),
                        ProjectModel.members.any(ProjectMemberRelation.user_id == uid),
                    )
                )
                .all()
        )
        for proj in other_projects:
            # 先刪 editor/member 關聯
            self.db.query(ProjectEditorRelation).filter_by(project_id=proj.id).delete(synchronize_session=False)
            self.db.query(ProjectMemberRelation).filter_by(project_id=proj.id).delete(synchronize_session=False)

            # 再刪掉這些專案底下的 payments（含所有 child tables）
            payments = (
                self.db.query(PaymentModel)
                    .filter_by(project_id=proj.id)
                    .options(
                        joinedload(PaymentModel.payer_relations),
                        joinedload(PaymentModel.split_relations),
                        joinedload(PaymentModel.items),
                    )
                    .all()
            )
            for pay in payments:
                self.db.delete(pay)

            # 最後刪掉專案本身
            self.db.delete(proj)

        if other_projects:
            print(f"🎉 Deleted {len(other_projects)} non-demo projects for user {uid}")

        # ——— upsert all referenced users ———
        all_member_uids = set(demo_project_payload["member"])
        all_member_uids.add(demo_project_payload["owner"])
        all_member_uids.add(uid)
        for member_uid in all_member_uids:
            existing = self.db.query(UserModel).get(member_uid)
            if not existing:
                self.db.add(UserModel(
                    uid=member_uid,
                    name=f"Member {member_uid[:6]}",
                    email=f"{member_uid[:8]}@demo.splitly",
                    uid_in_auth=member_uid,
                    avatar=1,
                ))
        self.db.flush()

        # ——— update/create demo user ———
        user = self.db.query(UserModel).get(uid)
        user.name   = demo_user_payload["name"]
        user.avatar = demo_user_payload["avatar"]
        print(f"🎉 User {pid} refresh")

        # ——— update/create project ———
        project = self.db.query(ProjectModel).get(pid)
        if not project:
            project = ProjectModel(id=pid, owner=demo_project_payload["owner"],
                                   project_name="", style="travel", currency="TWD", img=1)
            self.db.add(project)
            self.db.flush()
        
        # 更新基本欄位
        for field in ("project_name","start_time","end_time","style",
                    "currency","budget","desc","img","member_budgets"):
            val = demo_project_payload[field]
            # 如果是日期字段，把字串转成 date
            if field in ("start_time", "end_time") and val is not None:
                val = date.fromisoformat(val)
            setattr(project, field, val)

        # 更新 editor 關聯（全刪重加）
        self.db.query(ProjectEditorRelation).filter_by(project_id=pid).delete()
        for editor_uid in demo_project_payload["editor"]:
            self.db.add(ProjectEditorRelation(project_id=pid, user_id=editor_uid))

        # 更新 member 關聯（全刪重加）
        self.db.query(ProjectMemberRelation).filter_by(project_id=pid).delete()
        for member_uid in demo_project_payload["member"]:
            self.db.add(ProjectMemberRelation(project_id=pid, user_id=member_uid))
        print(f"🎉 Project {pid} refresh") 

        # ——— update payment ——— 
        payments = self.db.query(PaymentModel)\
                  .filter_by(project_id=pid)\
                  .options(joinedload(PaymentModel.payer_relations),
                           joinedload(PaymentModel.split_relations),
                           joinedload(PaymentModel.items))\
                  .all()

        for pay in payments:
            self.db.delete(pay)
        print(f"🎉 Payment delete") 

        for p in demo_payments:
            time = datetime.fromisoformat(p["time"])
            payment = PaymentModel(
                id            = p["id"],
                project_id    = p["project_id"],
                owner         = p["owner"],
                payment_name  = p["payment_name"],
                account_type  = p["account_type"],
                record_mode   = p["record_mode"],
                split_way     = p["split_way"],
                split_method  = p["split_method"],
                currency      = p["currency"],
                amount        = p["amount"],
                category_id   = p["category_id"],
                time          = time,
                desc          = p["desc"],
            )
            self.db.add(payment)

            # Add payer_map
            for u, amt in p["payer_map"].items():
                self.db.add(PaymentPayerRelation(
                    payment_id = p["id"],
                    user_id    = u,
                    amount     = amt,
                ))

            # Add split_map
            for u, detail in p["split_map"].items():
                self.db.add(PaymentSplitRelation(
                    payment_id = p["id"],
                    user_id    = u,
                    fixed      = detail["fixed"],
                    total      = detail["total"],
                    percent    = detail["percent"],
                ))

            # If split_way is item, create items and item_splits
            if p.get("split_way") == "item" and p.get("items"):
                for item_data in p["items"]:
                    model_item = ItemModel(
                        id          = str(uuid4()),
                        payment_id  = p["id"],
                        amount      = item_data["amount"],
                        split_method= item_data["split_method"],
                        payment_name= item_data["payment_name"],
                    )
                    self.db.add(model_item)

                    # 新增到 item_models 做後續組裝
                    for u, det in item_data["split_map"].items():
                        self.db.add(ItemSplitRelation(
                            item_id = model_item.id,
                            user_id = u,
                            fixed   = det["fixed"],
                            total   = det["total"],
                            percent = det["percent"],
                        ))
        print(f"🎉 Payment refresh") 

        try:
            self.db.commit()
            self.db.refresh(user)
            self.db.refresh(project)
            self.db.refresh(payment)
            return True
        except Exception as e:
            self.db.rollback()
            print(e)
            raise HTTPException(500, f"Demo reset failed: {e}")