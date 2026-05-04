from sqlalchemy import Column, Integer, Numeric, DateTime, func
from app.db.session import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True)
    monthly_income = Column(Numeric(12, 2))
    monthly_savings_goal = Column(Numeric(12, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
