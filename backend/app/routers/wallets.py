import app.services.wallets as svc
from app.db.session import get_db
from app.models.wallet import Wallet
from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session
from typing_extensions import Annotated

router = APIRouter(prefix="/wallets", tags=["wallets"])
WALLET_ID_NOT_FOUND = "Wallet ID not found"


@router.get("", response_model=list[Wallet])
def list_wallets(
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_wallets(db)


@router.get("/{wallet_id}")
def get_wallet(wallet_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_wallet(db, wallet_id)
    if not row:
        raise HTTPException(status_code=404, detail=WALLET_ID_NOT_FOUND)
    return row
