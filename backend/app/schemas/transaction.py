from decimal import Decimal
from datetime import date, datetime
from typing import Optional, Literal, List
from pydantic import BaseModel, ConfigDict

from .tag import Tag

TransactionType = Literal["debit", "credit"]


class TransactionCreate(BaseModel):
    date: date
    title: str
    amount: Decimal
    type: TransactionType = "debit"
    account_id: int
    category_id: Optional[int] = None
    debt_id: Optional[int] = None
    recurring_transaction_id: Optional[int] = None
    description: Optional[str] = None
    tag_ids: List[int] = []


class TransactionUpdate(BaseModel):
    date: Optional[date] = None
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    type: Optional[TransactionType] = None
    account_id: Optional[int] = None
    category_id: Optional[int] = None
    debt_id: Optional[int] = None
    recurring_transaction_id: Optional[int] = None
    description: Optional[str] = None
    tag_ids: Optional[List[int]] = None


class Transaction(BaseModel):
    id: int
    date: date
    title: str
    amount: Decimal
    type: TransactionType
    account_id: int
    category_id: Optional[int]
    debt_id: Optional[int]
    recurring_transaction_id: Optional[int]
    description: Optional[str]
    tags: List[Tag] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
