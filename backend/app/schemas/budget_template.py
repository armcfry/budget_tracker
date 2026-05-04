from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class BudgetTemplateCreate(BaseModel):
    category_id: int
    amount: Decimal
    is_active: bool = True


class BudgetTemplateUpdate(BaseModel):
    amount: Optional[Decimal] = None
    is_active: Optional[bool] = None


class BudgetTemplate(BaseModel):
    id: int
    category_id: int
    amount: Decimal
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
