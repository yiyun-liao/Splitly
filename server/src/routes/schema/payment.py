# server/src/routes/schema/payment.py

from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Literal
from datetime import datetime


# 分帳明細：splitMap 每個使用者的細節
class SplitDetail(BaseModel):
    fixed: float
    total: float
    percent: float

class CreatePaymentSchema(BaseModel):
    payment_name: str
    project_id: str
    owner: str  
    account_type: Literal["personal", "group"]
    record_mode: Optional[Literal["split", "debt"]] = None
    split_way: Optional[Literal["item", "person"]] = None
    split_method: Optional[Literal["percentage", "actual", "adjusted"]] = None
    currency: str
    amount: float
    category_id: Optional[int] = None
    time: datetime
    desc: Optional[str] = None

    payer_map: Dict[str, float]  # {uid: float}
    split_map: Dict[str, SplitDetail] # {uid: {fixed:float, total:float, percent:float}}

    model_config = {
        "from_attributes": True
    }



class GetPaymentSchema(CreatePaymentSchema):
    id: str

class GetPaymentListSchema(BaseModel):
    payments: List[GetPaymentSchema]


# item ============================

class CreateItemSchema(BaseModel):
    payment_id: str
    amount: float
    payment_name: str
    split_method: Literal["percentage", "actual", "adjusted"]
    split_map: Dict[str, SplitDetail]

    model_config = {
        "from_attributes": True
    }


class GetItemSchema(CreateItemSchema):
    id: str



# 更新用（所有欄位選填）
class UpdatePaymentSchema(BaseModel):
    payment_name: Optional[str] = None
    account_type: Optional[Literal["personal", "group"]] = None
    record_mode: Optional[Literal["split", "debt"]] = None
    split_way: Optional[Literal["item", "person"]] = None
    split_method: Optional[Literal["percentage", "actual", "adjusted"]] = None
    currency: Optional[str] = None
    amount: Optional[float] = None
    category_id: Optional[int] = None
    time: Optional[datetime] = None
    desc: Optional[str] = None
    payer_map: Optional[Dict[str, float]] = None
    split_map: Optional[Dict[str, SplitDetail]] = None


# schema/payment.py
class CreatePaymentRequestSchema(BaseModel):
    payload: CreatePaymentSchema
    items: Optional[List[CreateItemSchema]] = []

# response
class PaymentCreateMinimalResponse(BaseModel):
    success: bool
    payment_name: Optional[str]  = None
