from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.transaction import Transaction, TransactionCreate, TransactionUpdate
import app.services.transactions as svc

router = APIRouter(prefix="/transactions", tags=["transactions"])
TRANSACTION_NOT_FOUND = "Transaction not found"


@router.get("", response_model=list[Transaction])
def list_transactions(
    start_date: Annotated[date | None, Query()] = None,
    end_date: Annotated[date | None, Query()] = None,
    account_id: Annotated[int | None, Query()] = None,
    category_id: Annotated[int | None, Query()] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=500)] = 100,
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_transactions(db, start_date, end_date, account_id, category_id, skip, limit)


@router.get("/{transaction_id}", response_model=Transaction, responses={404: {"description": TRANSACTION_NOT_FOUND}})
def get_transaction(transaction_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_transaction(db, transaction_id)
    if not row:
        raise HTTPException(status_code=404, detail=TRANSACTION_NOT_FOUND)
    return row


@router.post("", response_model=Transaction, status_code=201)
def create_transaction(data: TransactionCreate, db: Annotated[Session, Depends(get_db)] = None):
    return svc.create_transaction(db, data)


@router.patch("/{transaction_id}", response_model=Transaction, responses={404: {"description": TRANSACTION_NOT_FOUND}})
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_transaction(db, transaction_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=TRANSACTION_NOT_FOUND)
    return row


@router.delete("/{transaction_id}", status_code=204, responses={404: {"description": TRANSACTION_NOT_FOUND}})
def delete_transaction(transaction_id: int, db: Annotated[Session, Depends(get_db)] = None):
    if not svc.delete_transaction(db, transaction_id):
        raise HTTPException(status_code=404, detail=TRANSACTION_NOT_FOUND)
