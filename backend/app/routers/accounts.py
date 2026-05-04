from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.account import Account, AccountCreate, AccountUpdate
import app.services.accounts as svc

router = APIRouter(prefix="/accounts", tags=["accounts"])

ACCOUNT_NOT_FOUND = "Account not found"


@router.get("", response_model=list[Account])
def list_accounts(
    active_only: Annotated[bool, Query()] = True,
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_accounts(db, active_only)


@router.get("/{account_id}", response_model=Account, responses={404: {"description": ACCOUNT_NOT_FOUND}})
def get_account(account_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_account(db, account_id)
    if not row:
        raise HTTPException(status_code=404, detail=ACCOUNT_NOT_FOUND)
    return row


@router.post("", response_model=Account, status_code=201)
def create_account(data: AccountCreate, db: Annotated[Session, Depends(get_db)] = None):
    return svc.create_account(db, data)


@router.patch("/{account_id}", response_model=Account, responses={404: {"description": ACCOUNT_NOT_FOUND}})
def update_account(
    account_id: int,
    data: AccountUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_account(db, account_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=ACCOUNT_NOT_FOUND)
    return row


@router.delete("/{account_id}", status_code=204, responses={404: {"description": ACCOUNT_NOT_FOUND}})
def delete_account(account_id: int, db: Annotated[Session, Depends(get_db)] = None):
    if not svc.delete_account(db, account_id):
        raise HTTPException(status_code=404, detail=ACCOUNT_NOT_FOUND)
