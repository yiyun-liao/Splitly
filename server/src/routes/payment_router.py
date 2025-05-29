# server/src/routes/payment_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.payment import CreatePaymentSchema, GetPaymentSchema, CreateItemSchema,PaymentCreateMinimalResponse, CreatePaymentRequestSchema
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
        def create_payment(body:CreatePaymentRequestSchema):
            try:
                db_session: Session = self.db.get_session()
                payment_db = PaymentDB(db_session)
                payment = payment_db.create_payment(body.payload, body.items)
                return {
                    "success": True,
                    "project_name": payment.payment_name
                }
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
