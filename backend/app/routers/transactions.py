from typing import Annotated

import app.services.transactions as svc
from app.db.session import get_db
from app.models.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(prefix="/transactions", tags=["transactions"])
TRANSACTION_NOT_FOUND = "Transaction not found"


@router.get("", response_model=list[TransactionRead])
def list_transactions(
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_transactions(db)


@router.get(
    "/{transaction_id}",
    response_model=TransactionRead,
    responses={404: {"description": TRANSACTION_NOT_FOUND}},
)
def get_transaction(
    transaction_id: int, db: Annotated[Session, Depends(get_db)] = None
):
    row = svc.get_transaction(db, transaction_id)
    if not row:
        raise HTTPException(status_code=404, detail=TRANSACTION_NOT_FOUND)
    return row


@router.post("", response_model=TransactionRead, status_code=201)
def create_transaction(
    data: TransactionCreate, db: Annotated[Session, Depends(get_db)] = None
):
    return svc.create_transaction(db, data)


@router.patch(
    "/{transaction_id}",
    response_model=TransactionRead,
    responses={404: {"description": TRANSACTION_NOT_FOUND}},
)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_transaction(db, transaction_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=TRANSACTION_NOT_FOUND)
    return row


@router.delete(
    "/{transaction_id}",
    status_code=204,
    responses={404: {"description": TRANSACTION_NOT_FOUND}},
)
def delete_transaction(
    transaction_id: int, db: Annotated[Session, Depends(get_db)] = None
):
    if not svc.delete_transaction(db, transaction_id):
        raise HTTPException(status_code=404, detail=TRANSACTION_NOT_FOUND)
