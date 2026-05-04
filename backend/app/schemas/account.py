from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict

AccountType = Literal["checking", "savings", "credit_card", "cash", "other"]


class AccountCreate(BaseModel):
    name: str
    type: AccountType
    nickname: Optional[str] = None
    last_four: Optional[str] = None
    is_active: bool = True


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[AccountType] = None
    nickname: Optional[str] = None
    last_four: Optional[str] = None
    is_active: Optional[bool] = None


class Account(BaseModel):
    id: int
    name: str
    type: AccountType
    nickname: Optional[str]
    last_four: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
