# # server/src/database/models/payment.py
# from sqlalchemy import Column, String, Integer, Enum, DateTime, ForeignKey, JSON
# from sqlalchemy.orm import relationship
# from datetime import datetime
# from src.database.models.base import Base
# import enum

# class RecordModeEnum(str, enum.Enum):
#     split = "split"
#     debt = "debt"

# class AccountTypeEnum(str, enum.Enum):
#     personal = "personal"
#     group = "group"

# class SplitWayEnum(str, enum.Enum):
#     item = "item"
#     person = "person"

# class SplitMethodEnum(str, enum.Enum):
#     percentage = "percentage"
#     actual = "actual"
#     adjusted = "adjusted"

# class PaymentModel(Base):
#     __tablename__ = "payments"

#     id = Column(String, primary_key=True, index=True)
#     project_id = Column(String, ForeignKey("projects.id"), nullable=False)

#     payment_name = Column(String, nullable=False)
#     account_type = Column(Enum(AccountTypeEnum), nullable=False)
#     record_mode = Column(Enum(RecordModeEnum), nullable=True)
#     split_way = Column(Enum(SplitWayEnum), nullable=True)
#     split_method = Column(Enum(SplitMethodEnum), nullable=True)

#     currency = Column(String, nullable=False)
#     amount = Column(Integer, nullable=False)
#     category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
#     time = Column(DateTime, nullable=False)
#     desc = Column(String, nullable=True)

#     payer_map = Column(JSON, nullable=False)     # { uid: amount }
#     split_map = Column(JSON, nullable=False)     # { uid: {fixed, total, percent} }

#     items = relationship("ItemModel", back_populates="payment")


# class ItemModel(Base):
#     __tablename__ = "items"

#     id = Column(String, primary_key=True, index=True)
#     payment_id = Column(String, ForeignKey("payments.id"), nullable=False)

#     amount = Column(Integer, nullable=False)
#     payment_name = Column(String, nullable=False)
#     split_method = Column(Enum(SplitMethodEnum), nullable=False)
#     split_map = Column(JSON, nullable=False)

#     payment = relationship("PaymentModel", back_populates="items")
