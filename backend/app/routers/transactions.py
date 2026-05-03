from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.transaction import Transaction, TransactionCreate, TransactionUpdate
import app.services.transactions as svc

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[Transaction])
def list_transactions(
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    account_id: int | None = Query(None),
    category_id: int | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return svc.get_transactions(db, start_date, end_date, account_id, category_id, skip, limit)


@router.get("/{transaction_id}", response_model=Transaction)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    row = svc.get_transaction(db, transaction_id)
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return row


@router.post("", response_model=Transaction, status_code=201)
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    return svc.create_transaction(db, data)


@router.patch("/{transaction_id}", response_model=Transaction)
def update_transaction(transaction_id: int, data: TransactionUpdate, db: Session = Depends(get_db)):
    row = svc.update_transaction(db, transaction_id, data)
    if not row:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return row


@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    if not svc.delete_transaction(db, transaction_id):
        raise HTTPException(status_code=404, detail="Transaction not found")
