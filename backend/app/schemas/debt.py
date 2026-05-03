from decimal import Decimal
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict

DebtType = Literal["mortgage", "auto", "student", "personal", "credit_card", "other"]


class DebtCreate(BaseModel):
    name: str
    type: DebtType
    original_balance: Decimal
    current_balance: Decimal
    interest_rate: Optional[Decimal] = None
    minimum_payment: Optional[Decimal] = None
    due_day_of_month: Optional[int] = None
    account_id: Optional[int] = None
    is_active: bool = True
    notes: Optional[str] = None


class DebtUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[DebtType] = None
    current_balance: Optional[Decimal] = None
    interest_rate: Optional[Decimal] = None
    minimum_payment: Optional[Decimal] = None
    due_day_of_month: Optional[int] = None
    account_id: Optional[int] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None


class Debt(BaseModel):
    id: int
    name: str
    type: DebtType
    original_balance: Decimal
    current_balance: Decimal
    interest_rate: Optional[Decimal]
    minimum_payment: Optional[Decimal]
    due_day_of_month: Optional[int]
    account_id: Optional[int]
    is_active: bool
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
