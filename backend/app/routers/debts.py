from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.debt import Debt, DebtCreate, DebtUpdate
import app.services.debts as svc

router = APIRouter(prefix="/debts", tags=["debts"])

DEBT_NOT_FOUND = "Debt not found"


@router.get("", response_model=list[Debt])
def list_debts(
    active_only: Annotated[bool, Query()] = True,
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_debts(db, active_only)


@router.get("/{debt_id}", response_model=Debt, responses={404: {"description": DEBT_NOT_FOUND}})
def get_debt(debt_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_debt(db, debt_id)
    if not row:
        raise HTTPException(status_code=404, detail=DEBT_NOT_FOUND)
    return row


@router.post("", response_model=Debt, status_code=201)
def create_debt(data: DebtCreate, db: Annotated[Session, Depends(get_db)] = None):
    return svc.create_debt(db, data)


@router.patch("/{debt_id}", response_model=Debt, responses={404: {"description": DEBT_NOT_FOUND}})
def update_debt(
    debt_id: int,
    data: DebtUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_debt(db, debt_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=DEBT_NOT_FOUND)
    return row


@router.delete("/{debt_id}", status_code=204, responses={404: {"description": DEBT_NOT_FOUND}})
def delete_debt(debt_id: int, db: Annotated[Session, Depends(get_db)] = None):
    if not svc.delete_debt(db, debt_id):
        raise HTTPException(status_code=404, detail=DEBT_NOT_FOUND)
