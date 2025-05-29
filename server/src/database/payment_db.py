# server/src/database/payment_db.py

# server/src/database/payment_db.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime

from src.database.models.payment import PaymentModel, PaymentPayerRelation, PaymentSplitRelation, ItemModel, ItemSplitRelation
from src.routes.schema.payment import CreatePaymentSchema, SplitDetail, CreateItemSchema


class PaymentDB:
    def __init__(self, db: Session):
        self.db = db

    def create_payment(self, payment_data: CreatePaymentSchema, items: list[CreateItemSchema] = []):
        payment_id = str(uuid4())

        payment = PaymentModel(
            id=payment_id,
            project_id=payment_data.project_id,
            owner=payment_data.owner,
            payment_name=payment_data.payment_name,
            account_type=payment_data.account_type,
            record_mode=payment_data.record_mode,
            split_way=payment_data.split_way,
            split_method=payment_data.split_method,
            currency=payment_data.currency,
            amount=payment_data.amount,
            category_id=payment_data.category_id,
            time=payment_data.time,
            desc=payment_data.desc,
        )
        self.db.add(payment)

        # 加入 Payer 關聯
        for uid, amount in payment_data.payer_map.items():
            self.db.add(PaymentPayerRelation(
                payment_id=payment_id,
                user_id=uid,
                amount=amount
            ))

        # 加入 Split 關聯
        for uid, detail in payment_data.split_map.items():
            self.db.add(PaymentSplitRelation(
                payment_id=payment_id,
                user_id=uid,
                fixed=detail.fixed,
                total=detail.total,
                percent=detail.percent
            ))

        # 如果是 item-based 分帳方式，建立 item 與其分帳關聯
        if payment_data.split_way == "item":
            for item_data in items:
                item_id = str(uuid4())
                item = ItemModel(
                    id=item_id,
                    payment_id=payment_id,
                    amount=item_data.amount,
                    payment_name=item_data.payment_name,
                )
                self.db.add(item)

                for uid, detail in item_data.split_map.items():
                    self.db.add(ItemSplitRelation(
                        item_id=item_id,
                        user_id=uid,
                        fixed=detail.fixed,
                        total=detail.total,
                        percent=detail.percent
                    ))
        try:
            self.db.commit()
            self.db.refresh(payment)
            return payment
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Create Payment failed: {str(e)}")
