from decimal import Decimal
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class SettingsUpdate(BaseModel):
    monthly_income: Optional[Decimal] = None
    monthly_savings_goal: Optional[Decimal] = None


class Settings(BaseModel):
    id: int
    monthly_income: Optional[Decimal]
    monthly_savings_goal: Optional[Decimal]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
