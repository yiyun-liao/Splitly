# server/src/routes/schema/payment.py

from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Literal
from datetime import datetime


# 分帳明細：splitMap 每個使用者的細節
class SplitDetail(BaseModel):
    fixed: float
    total: float
    percent: float

# ====================== Item ======================
class ItemDetailSchema(BaseModel):
    payment_id: str
    amount: float
    payment_name: str
    split_method: Literal["percentage", "actual", "adjusted"]
    split_map: Dict[str, SplitDetail]

class GetItemSchema(ItemDetailSchema):
    id: str

# ====================== Payment ======================
class CreatePaymentSchema(BaseModel):
    project_id: str
    payment_name: str
    account_type: Literal["personal", "group"]
    record_mode: Optional[Literal["split", "debt"]] = None
    split_way: Optional[Literal["item", "person"]] = None
    split_method: Optional[Literal["percentage", "actual", "adjusted"]] = None
    owner: str  
    currency: str
    amount: float
    category_id: Optional[int] = None
    time: datetime
    desc: Optional[str] = None

    payer_map: Dict[str, float]  # {uid: float}
    split_map: Dict[str, SplitDetail] # {uid: {fixed:float, total:float, percent:float}}

    items: Optional[List[ItemDetailSchema]] = None

    model_config = {
        "from_attributes": True
    }


# ====================== update ======================
class UpdateItemDetailSchema(BaseModel):
    id: Optional[str] = None  # 若為新建可不填，否則提供原本 item id
    payment_id: Optional[str] = None
    amount: float
    payment_name: str
    split_method: Literal["percentage", "actual", "adjusted"]
    split_map: Dict[str, SplitDetail]


class UpdatePaymentSchema(BaseModel):
    id: str  # 更新用需指定原 payment id
    payment_name: Optional[str] = None
    project_id: Optional[str] = None
    owner: Optional[str] = None
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
    items: Optional[List[UpdateItemDetailSchema]] = None

    model_config = {
        "from_attributes": True
    }


# ====================== get ======================
class GetPaymentSchema(BaseModel):
    id: str
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

    items: Optional[List[GetItemSchema]] = None

    model_config = {
        "from_attributes": True
    }


class GetPaymentListSchema(BaseModel):
    payments: List[GetPaymentSchema]



# response
class PaymentCreateMinimalResponse(BaseModel):
    success: bool
    payment: Optional[GetPaymentSchema] = None
    payment_name: Optional[str]  = None
