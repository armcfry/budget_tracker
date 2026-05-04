from sqlalchemy import Column, Integer, Numeric, SmallInteger, DateTime, ForeignKey, func, UniqueConstraint
from app.db.session import Base


class MonthlyBudget(Base):
    __tablename__ = "monthly_budgets"

    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    year = Column(SmallInteger, nullable=False)
    month = Column(SmallInteger, nullable=False)
    budget_amount = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint("category_id", "year", "month"),)
