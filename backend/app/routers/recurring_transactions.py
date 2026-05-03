from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.recurring_transaction import RecurringTransaction, RecurringTransactionCreate, RecurringTransactionUpdate
import app.services.recurring_transactions as svc

router = APIRouter(prefix="/recurring-transactions", tags=["recurring-transactions"])


@router.get("", response_model=list[RecurringTransaction])
def list_recurring_transactions(active_only: bool = Query(True), db: Session = Annotated[Depends(get_db)]):
    return svc.get_recurring_transactions(db, active_only)


@router.get("/{rt_id}", response_model=RecurringTransaction)
def get_recurring_transaction(rt_id: int, db: Session = Annotated[Depends(get_db)]):
    row = svc.get_recurring_transaction(db, rt_id)
    if not row:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    return row


@router.post("", response_model=RecurringTransaction, status_code=201)
def create_recurring_transaction(data: RecurringTransactionCreate, db: Session = Annotated[Depends(get_db)]):
    return svc.create_recurring_transaction(db, data)


@router.patch("/{rt_id}", response_model=RecurringTransaction)
def update_recurring_transaction(rt_id: int, data: RecurringTransactionUpdate, db: Session = Annotated[Depends(get_db)]):
    row = svc.update_recurring_transaction(db, rt_id, data)
    if not row:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
    return row


@router.delete("/{rt_id}", status_code=204)
def delete_recurring_transaction(rt_id: int, db: Session = Annotated[Depends(get_db)]):
    if not svc.delete_recurring_transaction(db, rt_id):
        raise HTTPException(status_code=404, detail="Recurring transaction not found")
