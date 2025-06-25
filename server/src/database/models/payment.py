# server/src/database/models/payment.py
from sqlalchemy import Column, String, Float, Enum, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from src.database.models.base import Base
import enum


class RecordModeEnum(str, enum.Enum):
    split = "split"
    debt = "debt"


class AccountTypeEnum(str, enum.Enum):
    personal = "personal"
    group = "group"


class SplitWayEnum(str, enum.Enum):
    item = "item"
    person = "person"


class SplitMethodEnum(str, enum.Enum):
    percentage = "percentage"
    actual = "actual"
    adjusted = "adjusted"


# ====================== Payment ======================
class PaymentModel(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    owner = Column(String, ForeignKey("users.uid", ondelete="CASCADE"), nullable=False, index=True) 

    payment_name = Column(String, nullable=False)
    account_type = Column(Enum(AccountTypeEnum), nullable=False)
    record_mode = Column(Enum(RecordModeEnum), nullable=True)
    split_way = Column(Enum(SplitWayEnum), nullable=True)
    split_method = Column(Enum(SplitMethodEnum), nullable=True)

    currency = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=True)
    time = Column(DateTime, nullable=False)
    desc = Column(String, nullable=True)

    creator = relationship("UserModel", back_populates="created_payments", foreign_keys=[owner])
    category = relationship("CategoryModel", back_populates="payments")
    payer_relations = relationship("PaymentPayerRelation", back_populates="payment", cascade="all, delete-orphan", passive_deletes=True,)
    split_relations = relationship("PaymentSplitRelation", back_populates="payment", cascade="all, delete-orphan", passive_deletes=True,)
    items = relationship("ItemModel", back_populates="payment", cascade="all, delete-orphan", passive_deletes=True,)


class PaymentPayerRelation(Base):
    __tablename__ = "payment_payers"

    payment_id = Column(String, ForeignKey("payments.id", ondelete="CASCADE"), primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.uid", ondelete="CASCADE"), primary_key=True, index=True)
    amount = Column(Float, nullable=False)

    user = relationship("UserModel", back_populates="payment_payers")
    payment = relationship("PaymentModel", back_populates="payer_relations")


class PaymentSplitRelation(Base):
    __tablename__ = "payment_splits"

    payment_id = Column(String, ForeignKey("payments.id", ondelete="CASCADE"), primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.uid", ondelete="CASCADE"), primary_key=True, index=True)
    fixed = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    percent = Column(Float, nullable=False)

    user = relationship("UserModel", back_populates="payment_splits")
    payment = relationship("PaymentModel", back_populates="split_relations")


# ====================== Item ======================
class ItemModel(Base):
    __tablename__ = "items"

    id = Column(String, primary_key=True, index=True)
    payment_id = Column(String, ForeignKey("payments.id", ondelete="CASCADE"), nullable=False, index=True)

    split_method = Column(Enum(SplitMethodEnum), nullable=False)
    amount = Column(Float, nullable=False)
    payment_name = Column(String, nullable=False)

    payment = relationship("PaymentModel", back_populates="items")
    split_relations = relationship("ItemSplitRelation", back_populates="item", cascade="all, delete-orphan", passive_deletes=True,)



class ItemSplitRelation(Base):
    __tablename__ = "item_splits"

    item_id = Column(String, ForeignKey("items.id", ondelete="CASCADE"), primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.uid", ondelete="CASCADE"), primary_key=True, index=True)
    fixed = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    percent = Column(Float, nullable=False)

    user = relationship("UserModel", back_populates="item_splits")
    item = relationship("ItemModel", back_populates="split_relations")
