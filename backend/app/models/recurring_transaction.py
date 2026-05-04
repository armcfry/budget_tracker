from sqlalchemy import Column, Integer, String, Numeric, Boolean, SmallInteger, Text, DateTime, ForeignKey, func
from app.db.session import Base


class RecurringTransaction(Base):
    __tablename__ = "recurring_transactions"

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(String(10), nullable=False, default="debit")
    account_id = Column(Integer, ForeignKey("accounts.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    debt_id = Column(Integer, ForeignKey("debts.id"))
    day_of_month = Column(SmallInteger)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
