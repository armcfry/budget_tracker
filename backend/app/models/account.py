from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from app.db.session import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    nickname = Column(String(100))
    last_four = Column(String(4))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
