from datetime import date, datetime
from decimal import Decimal
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict

from .tag import Tag

TransactionType = Literal["debit", "credit"]


class TransactionCreate(BaseModel):
    date_value: date
    description: str
    amount: Decimal
    type: TransactionType = "debit"
    account_id: int
    tag_ids: List[int] = []


class TransactionUpdate(BaseModel):
    date_value: Optional[date] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    type: Optional[TransactionType] = None
    account_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None


class Transaction(BaseModel):
    id: int
    date_value: date
    description: str
    amount: Decimal
    type: TransactionType
    account_id: int

    model_config = ConfigDict(from_attributes=True)
