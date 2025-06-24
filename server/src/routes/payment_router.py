# server/src/routes/payment_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.payment import CreatePaymentSchema,PaymentCreateMinimalResponse,GetPaymentListSchema,UpdatePaymentSchema
from src.database.payment_db import PaymentDB
from src.dependencies.database import get_db_session


class PaymentRouter:
    def __init__(self):
        self.router = APIRouter()
        self._add_routes()

    def _add_routes(self):
        # 建立 Payment（含 Item）
        @self.router.post("/api/payment", response_model=PaymentCreateMinimalResponse)
        def create_payment(body: CreatePaymentSchema, db: Session = Depends(get_db_session)):
            try:
                payment_db = PaymentDB(db)
                payment = payment_db.create_payment(body)
                return {
                    "success": True,
                    "payment": payment
                }
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        # 取得某專案的費用列表
        @self.router.get("/api/payment/by-project", response_model=GetPaymentListSchema)
        def get_payments_by_project(pid: str, db: Session = Depends(get_db_session)):
            try:
                payment_db = PaymentDB(db)
                all_project = payment_db.get_payments_by_project(pid)
                return all_project
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        # 更新紀錄
        @self.router.put("/api/payment/by-payment", response_model=PaymentCreateMinimalResponse)
        def update_payment(paymentId: str, body: UpdatePaymentSchema, db: Session = Depends(get_db_session)):
            try:
                if not body.id:
                    body.id = paymentId
                payment_db = PaymentDB(db)
                new_payment = payment_db.update_payment(body)
                if not new_payment:
                    raise HTTPException(status_code=404, detail="Payment not found or update failed")

                return {"success": True, "payment": new_payment}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Update payment failed: {str(e)}")

        # 刪除紀錄
        @self.router.delete("/api/payment/by-payment", response_model=PaymentCreateMinimalResponse)
        def delete_payment(paymentId: str, db: Session = Depends(get_db_session)):
            try:
                payment_db = PaymentDB(db)
                delete_success = payment_db.delete_payment(paymentId)
                if delete_success == True:
                    return {"success": True, "payment_id": paymentId}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Delete payment failed: {str(e)}")
        
        #重建 demo project
        @self.router.put("/api/payment/demo-project", response_model=PaymentCreateMinimalResponse)
        def rebuild_payment(
            paymentId: str, db: Session = Depends(get_db_session)):
            try:
                payment_db = PaymentDB(db)
                delete_success = payment_db.delete_payment(paymentId)
                if delete_success == True:
                    for payment in payments:
                        payment_db.create_payment(payment)
                    return {"success": True, "payment_id": paymentId}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Delete payment failed: {str(e)}")