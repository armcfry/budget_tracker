from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.account import Account, AccountCreate, AccountUpdate
import app.services.accounts as svc

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("", response_model=list[Account])
def list_accounts(active_only: bool = Query(True), db: Session = Depends(get_db)):
    return svc.get_accounts(db, active_only)


@router.get("/{account_id}", response_model=Account)
def get_account(account_id: int, db: Session = Depends(get_db)):
    row = svc.get_account(db, account_id)
    if not row:
        raise HTTPException(status_code=404, detail="Account not found")
    return row


@router.post("", response_model=Account, status_code=201)
def create_account(data: AccountCreate, db: Session = Depends(get_db)):
    return svc.create_account(db, data)


@router.patch("/{account_id}", response_model=Account)
def update_account(account_id: int, data: AccountUpdate, db: Session = Depends(get_db)):
    row = svc.update_account(db, account_id, data)
    if not row:
        raise HTTPException(status_code=404, detail="Account not found")
    return row


@router.delete("/{account_id}", status_code=204)
def delete_account(account_id: int, db: Session = Depends(get_db)):
    if not svc.delete_account(db, account_id):
        raise HTTPException(status_code=404, detail="Account not found")
