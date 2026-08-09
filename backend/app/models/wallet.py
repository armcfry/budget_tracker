from decimal import Decimal
from typing import Optional

from sqlmodel import Field, SQLModel


class WalletBase(SQLModel):
    name: str
    total_balance: Decimal = Decimal("0.00")
    total_spend: Decimal = Decimal("0.00")


class Wallet(WalletBase, table=True):
    __tablename__ = "wallets"

    id: Optional[int] = Field(default=None, primary_key=True)


class WalletCreate(WalletBase):
    pass


class WalletUpdate(SQLModel):
    name: Optional[str] = None
