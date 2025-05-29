# server/src/database/payment_db.py

# server/src/database/payment_db.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import uuid4
from datetime import datetime

from src.database.models.payment import PaymentModel, PaymentPayerRelation, PaymentSplitRelation, ItemModel, ItemSplitRelation
from src.routes.schema.payment import CreatePaymentSchema, SplitDetail,GetPaymentListSchema,GetPaymentSchema, GetItemSchema,UpdatePaymentSchema


class PaymentDB:
    def __init__(self, db: Session):
        self.db = db

    def create_payment(self, payment_data: CreatePaymentSchema) -> PaymentModel:
        payment_id = str(uuid4())

        # Create PaymentModel
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
            desc=payment_data.desc
        )
        self.db.add(payment)

        # Add payer_map
        for user_id, amount in payment_data.payer_map.items():
            self.db.add(PaymentPayerRelation(
                payment_id=payment_id,
                user_id=user_id,
                amount=amount
            ))

        # Add split_map
        for user_id, detail in payment_data.split_map.items():
            self.db.add(PaymentSplitRelation(
                payment_id=payment_id,
                user_id=user_id,
                fixed=detail.fixed,
                total=detail.total,
                percent=detail.percent
            ))

        # If split_way is item, create items and item_splits
        if payment_data.split_way == "item" and payment_data.items:
            for item in payment_data.items:
                item_id = str(uuid4())
                new_item = ItemModel(
                    id=item_id,
                    payment_id=payment_id,
                    amount=item.amount,
                    split_method=item.split_method,
                    payment_name=item.payment_name
                )
                self.db.add(new_item)

                for uid, detail in item.split_map.items():
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


    def get_payments_by_project(self, project_id: str) -> GetPaymentListSchema:
        try:
            payments = (
                self.db.query(PaymentModel)
                .filter(PaymentModel.project_id == project_id, PaymentModel.deleted_at == None)
                .all()
            )
            result = []
            for payment in payments:
                # 取出 payer_map
                payer_map = {
                    relation.user_id: relation.amount
                    for relation in payment.payer_relations
                }
                # 取出 split_map
                split_map = {
                    relation.user_id: SplitDetail(
                        fixed=relation.fixed,
                        total=relation.total,
                        percent=relation.percent
                    )
                    for relation in payment.split_relations
                }

                # 取出 items
                items = []
                for item in payment.items:
                    item_split_map = {
                        relation.user_id: SplitDetail(
                            fixed=relation.fixed,
                            total=relation.total,
                            percent=relation.percent
                        )
                        for relation in item.split_relations
                    }

                    items.append(GetItemSchema(
                        id=item.id,
                        payment_id=item.payment_id,
                        amount=item.amount,
                        payment_name=item.payment_name,
                        split_method=item.split_method,
                        split_map=item_split_map
                    ))

                result.append(GetPaymentSchema(
                    id=payment.id,
                    payment_name=payment.payment_name,
                    project_id=payment.project_id,
                    owner=payment.owner,
                    account_type=payment.account_type,
                    record_mode=payment.record_mode,
                    split_way=payment.split_way,
                    split_method=payment.split_method,
                    currency=payment.currency,
                    amount=payment.amount,
                    category_id=payment.category_id,
                    time=payment.time,
                    desc=payment.desc,
                    payer_map=payer_map,
                    split_map=split_map,
                    items=items if items else None
                ))

            return GetPaymentListSchema(payments=result)
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Get payments failed: {str(e)}")


    def update_payment(self, payment_data: UpdatePaymentSchema) -> PaymentModel:
        payment = self.db.query(PaymentModel).filter_by(id=payment_data.id).first()
        if not payment:
            raise ValueError(f"Payment not found: {payment_data.id}")

        # === 更新主資料 ===
        for field, value in payment_data.model_dump(exclude_unset=True).items():
            if field not in {"payer_map", "split_map", "items", "id"}:
                setattr(payment, field, value)

        # === 清除舊的 payer/split 關聯 ===
        self.db.query(PaymentPayerRelation).filter_by(payment_id=payment.id).delete()
        self.db.query(PaymentSplitRelation).filter_by(payment_id=payment.id).delete()

        # === 建立新的 payer_map ===
        for user_id, amt in payment_data.payer_map.items():
            self.db.add(PaymentPayerRelation(
                payment_id=payment.id,
                user_id=user_id,
                amount=amt
            ))

        # === 建立新的 split_map ===
        for uid, split in payment_data.split_map.items():
            self.db.add(PaymentSplitRelation(
                payment_id=payment.id,
                user_id=uid,
                fixed=split.fixed,
                total=split.total,
                percent=split.percent
            ))

        # === 清除舊 item 與 split（強刪除） ===
        for item in payment.items:
            self.db.query(ItemSplitRelation).filter_by(item_id=item.id).delete()
            self.db.delete(item)

        # === 重新建立 items（若是 item 模式）===
        if payment_data.split_way == "item" and payment_data.items:
            for item_data in payment_data.items:
                new_item_id = str(uuid4())
                new_item = ItemModel(
                    id=new_item_id,
                    payment_id=payment.id,
                    amount=item_data.amount,
                    payment_name=item_data.payment_name,
                    split_method=item_data.split_method
                )
                self.db.add(new_item)

                for uid, split in item_data.split_map.items():
                    self.db.add(ItemSplitRelation(
                        item_id=new_item_id,
                        user_id=uid,
                        fixed=split.fixed,
                        total=split.total,
                        percent=split.percent
                    ))
        try:
            self.db.commit()
            return payment
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=500, detail=f"Get payments failed: {str(e)}")
