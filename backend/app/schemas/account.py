from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict

AccountType = Literal["checking", "savings", "credit_card", "other"]


class AccountCreate(BaseModel):
    name: str
    type: AccountType


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[AccountType] = None


class Account(BaseModel):
    id: int
    name: str
    type: AccountType

    model_config = ConfigDict(from_attributes=True)
