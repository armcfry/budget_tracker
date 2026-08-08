from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True)
    wallet_id = Column(Integer, ForeignKey("wallets.id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    balance = Column(Integer, nullable=False, default=0);