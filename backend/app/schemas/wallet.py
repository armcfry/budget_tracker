from typing import Optional

from pydantic import BaseModel, ConfigDict


class WalletCreate(BaseModel):
    name: str
    total_balance: int = 0
    total_spend: int = 0


class WalletUpdate(BaseModel):
    name: Optional[str] = None


class Wallet(BaseModel):
    id: int
    name: str
    total_balance: int
    total_spend: int

    model_config = ConfigDict(from_attributes=True)
