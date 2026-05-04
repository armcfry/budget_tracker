from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.recurring_transaction import RecurringTransaction, RecurringTransactionCreate, RecurringTransactionUpdate
import app.services.recurring_transactions as svc

router = APIRouter(prefix="/recurring-transactions", tags=["recurring-transactions"])

RECURRING_TRANSACTION_NOT_FOUND = "Recurring transaction not found"


@router.get("", response_model=list[RecurringTransaction])
def list_recurring_transactions(
    active_only: Annotated[bool, Query()] = True,
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_recurring_transactions(db, active_only)


@router.get("/{rt_id}", response_model=RecurringTransaction, responses={404: {"description": RECURRING_TRANSACTION_NOT_FOUND}})
def get_recurring_transaction(rt_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_recurring_transaction(db, rt_id)
    if not row:
        raise HTTPException(status_code=404, detail=RECURRING_TRANSACTION_NOT_FOUND)
    return row


@router.post("", response_model=RecurringTransaction, status_code=201)
def create_recurring_transaction(data: RecurringTransactionCreate, db: Annotated[Session, Depends(get_db)] = None):
    return svc.create_recurring_transaction(db, data)


@router.patch("/{rt_id}", response_model=RecurringTransaction, responses={404: {"description": RECURRING_TRANSACTION_NOT_FOUND}})
def update_recurring_transaction(
    rt_id: int,
    data: RecurringTransactionUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_recurring_transaction(db, rt_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=RECURRING_TRANSACTION_NOT_FOUND)
    return row


@router.delete("/{rt_id}", status_code=204, responses={404: {"description": RECURRING_TRANSACTION_NOT_FOUND}})
def delete_recurring_transaction(rt_id: int, db: Annotated[Session, Depends(get_db)] = None):
    if not svc.delete_recurring_transaction(db, rt_id):
        raise HTTPException(status_code=404, detail=RECURRING_TRANSACTION_NOT_FOUND)
