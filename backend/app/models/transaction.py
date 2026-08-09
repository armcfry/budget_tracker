from app.db.session import Base
from sqlalchemy import Column, Date, ForeignKey, Integer, Numeric, String


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True)
    date_value = Column(Date, nullable=False)
    description = Column(String(200), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
