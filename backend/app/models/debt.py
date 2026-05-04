from sqlalchemy import Column, Integer, String, Numeric, Boolean, SmallInteger, Text, DateTime, ForeignKey, func
from app.db.session import Base


class Debt(Base):
    __tablename__ = "debts"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    original_balance = Column(Numeric(12, 2), nullable=False)
    current_balance = Column(Numeric(12, 2), nullable=False)
    interest_rate = Column(Numeric(6, 4))
    minimum_payment = Column(Numeric(12, 2))
    due_day_of_month = Column(SmallInteger)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    is_active = Column(Boolean, default=True)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
