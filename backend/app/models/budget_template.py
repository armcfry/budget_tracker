from sqlalchemy import Column, Integer, Numeric, Boolean, DateTime, ForeignKey, func
from app.db.session import Base


class BudgetTemplate(Base):
    __tablename__ = "budget_templates"

    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, unique=True)
    amount = Column(Numeric(12, 2), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
