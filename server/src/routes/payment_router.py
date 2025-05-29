# server/src/routes/payment_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.payment import CreatePaymentSchema,PaymentCreateMinimalResponse,GetPaymentListSchema,UpdatePaymentSchema
from src.database.payment_db import PaymentDB
from src.database.relational_db import Database

class PaymentRouter:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db
        self._add_routes()

    def _add_routes(self):
        # 建立 Payment（含 Item）
        @self.router.post("/api/payment", response_model=PaymentCreateMinimalResponse)
        def create_payment(body: CreatePaymentSchema):
            try:
                db_session: Session = self.db.get_session()
                payment_db = PaymentDB(db_session)
                payment = payment_db.create_payment(body)
                return {
                    "success": True,
                    "project_name": payment.payment_name
                }
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        # 取得某專案的費用列表
        @self.router.get("/api/payment/by-project", response_model=GetPaymentListSchema)
        def get_payments_by_project(pid: str):
            try:
                db_session: Session = self.db.get_session()
                payment_db = PaymentDB(db_session)
                all_project = payment_db.get_payments_by_project(pid)
                return all_project
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        # 更新費用
        @self.router.put("/api/payment/by-payment", response_model=PaymentCreateMinimalResponse)
        def update_payment(body: UpdatePaymentSchema):
            try:
                db_session: Session = self.db.get_session()
                payment_db = PaymentDB(db_session)
                new_payment = payment_db.update_payment(body)
                return {"success": True, "payment_name": new_payment.payment_name}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Update payment failed: {str(e)}")
