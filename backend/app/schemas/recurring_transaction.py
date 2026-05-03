from decimal import Decimal
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict, Field

TransactionType = Literal["debit", "credit"]


class RecurringTransactionCreate(BaseModel):
    title: str
    amount: Decimal
    type: TransactionType = "debit"
    account_id: Optional[int] = None
    category_id: Optional[int] = None
    debt_id: Optional[int] = None
    day_of_month: Optional[int] = Field(default=None, ge=1, le=31)
    description: Optional[str] = None
    is_active: bool = True


class RecurringTransactionUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    type: Optional[TransactionType] = None
    account_id: Optional[int] = None
    category_id: Optional[int] = None
    debt_id: Optional[int] = None
    day_of_month: Optional[int] = Field(default=None, ge=1, le=31)
    description: Optional[str] = None
    is_active: Optional[bool] = None


class RecurringTransaction(BaseModel):
    id: int
    title: str
    amount: Decimal
    type: TransactionType
    account_id: Optional[int]
    category_id: Optional[int]
    debt_id: Optional[int]
    day_of_month: Optional[int]
    description: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
