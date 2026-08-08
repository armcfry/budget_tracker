

from sqlalchemy import Column, Integer, String, Float
from backend.app.db.session import Base


class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    total_balance = Column(Float, nullable=False, default=0)
    total_spent = Column(Float, nullable=False, default=0)
