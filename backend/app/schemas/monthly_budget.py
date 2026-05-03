from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class MonthlyBudgetCreate(BaseModel):
    category_id: int
    year: int
    month: int = Field(ge=1, le=12)
    budget_amount: Decimal


class MonthlyBudgetUpdate(BaseModel):
    budget_amount: Optional[Decimal] = None


class MonthlyBudget(BaseModel):
    id: int
    category_id: int
    year: int
    month: int
    budget_amount: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
