from datetime import date
from decimal import Decimal
from typing import List, Optional

from app.models.tag import Tag
from app.models.transaction_tag import TransactionTag
from sqlalchemy import Index
from sqlmodel import Field, Relationship, SQLModel


class TransactionBase(SQLModel):
    date_value: date
    description: str
    amount: Decimal
    account_id: int = Field(foreign_key="accounts.id")
    recurring: bool = Field(default=False, nullable=False)


class Transaction(TransactionBase, table=True):
    __tablename__ = "transactions"
    __table_args__ = (
        Index("idx_transactions_date", "date_value"),
        Index("idx_transactions_account", "account_id"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    tags: List[Tag] = Relationship(link_model=TransactionTag)


class TransactionCreate(TransactionBase):
    tags: List[str] = []  # tag names; handled in the service layer, not a DB column


class TransactionUpdate(SQLModel):
    date_value: Optional[date] = None
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    account_id: Optional[int] = None
    recurring: Optional[bool] = None
    tags: Optional[List[str]] = None


class TransactionRead(TransactionBase):
    id: int
    tags: List[Tag] = []
