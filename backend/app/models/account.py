from typing import Optional

from sqlmodel import Field, SQLModel


class AccountBase(SQLModel):
    name: str
    type: str
    balance: float = 0.0


class Account(AccountBase, table=True):
    __tablename__ = "accounts"

    id: Optional[int] = Field(default=None, primary_key=True)
    wallet_id: int = Field(foreign_key="wallets.id")


class AccountCreate(AccountBase):
    wallet_id: int


class AccountUpdate(SQLModel):
    name: Optional[str] = None
    type: Optional[str] = None
