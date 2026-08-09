from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

AccountType = Literal["checking", "savings", "credit_card", "other"]


class AccountCreate(BaseModel):
    name: str
    type: AccountType
    balance: float = 0.0


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[AccountType] = None


class Account(BaseModel):
    id: int
    name: str
    type: AccountType
    balance: float

    model_config = ConfigDict(from_attributes=True)
