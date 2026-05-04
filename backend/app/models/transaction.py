from sqlalchemy import Column, Integer, String, Numeric, Text, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.transaction_tag import transaction_tags


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    date = Column(Date, nullable=False)
    title = Column(String(200), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(String(10), nullable=False, default="debit")
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    debt_id = Column(Integer, ForeignKey("debts.id"))
    recurring_transaction_id = Column(Integer, ForeignKey("recurring_transactions.id"))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    tags = relationship("Tag", secondary=transaction_tags, back_populates="transactions")
