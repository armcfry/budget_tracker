from datetime import date
from decimal import Decimal
from typing import List, Optional

from app.models.tag import Tag
from app.models.transaction_tag import TransactionTag
from sqlmodel import Field, Relationship, SQLModel


class TransactionBase(SQLModel):
    date_value: date
    description: str
    amount: Decimal
    account_id: int = Field(foreign_key="accounts.id")


class Transaction(TransactionBase, table=True):
    __tablename__ = "transactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    tags: List[Tag] = Relationship(link_model=TransactionTag)


class TransactionCreate(TransactionBase):
    tag_ids: List[int] = []  # handled in the service layer, not a DB column


class TransactionUpdate(SQLModel):
    date_value: Optional[date] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    account_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None
