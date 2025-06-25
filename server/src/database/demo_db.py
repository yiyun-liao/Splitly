#server/src/database/demo_db.py
from fastapi import HTTPException
from uuid import uuid4
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from src.database.models.user import UserModel
from src.database.models.project import ProjectModel, ProjectEditorRelation, ProjectMemberRelation
from src.database.models.payment import PaymentModel, PaymentPayerRelation, PaymentSplitRelation, ItemModel, ItemSplitRelation
from src.database.models.base import Base
from datetime import datetime, date

import json
from pathlib import Path

# 找到 demo_data.json 的绝对路径
HERE = Path(__file__).parent.parent.parent / "scripts"
DATA_PATH = HERE / "demo_data.json"

with DATA_PATH.open(encoding="utf-8") as f:
    demo_data = json.load(f)

# 拆解
demo_user_payload    = demo_data["userData"]
demo_project_payload = demo_data["project"]
demo_payments        = demo_data["payment"]["payments"]


class DemoDB:
    def __init__(self, db: Session):
        self.db = db
    
    def refresh_demo_all(self, uid: str, pid:str):
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

        # ——— update user ——— 
        user = self.db.query(UserModel).get(uid)
        if not user:
            raise HTTPException(404, "User not found")
        user.name   = demo_user_payload["name"]
        user.avatar = demo_user_payload["avatar"]
        print(f"🎉 User {pid} refresh") 

        # ——— update project ——— 
        project = self.db.query(ProjectModel).get(pid)
        if not project:
            raise HTTPException(404, "Project not found")
        
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