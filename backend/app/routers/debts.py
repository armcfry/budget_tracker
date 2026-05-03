from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.debt import Debt, DebtCreate, DebtUpdate
import app.services.debts as svc

router = APIRouter(prefix="/debts", tags=["debts"])


@router.get("", response_model=list[Debt])
def list_debts(active_only: bool = Annotated[Query(True)], db: Session = Annotated[Depends(get_db)]):
    return svc.get_debts(db, active_only)


@router.get("/{debt_id}", response_model=Debt)
def get_debt(debt_id: int, db: Session = Annotated[Depends(get_db)]):
    row = svc.get_debt(db, debt_id)
    if not row:
        raise HTTPException(status_code=404, detail="Debt not found")
    return row


@router.post("", response_model=Debt, status_code=201)
def create_debt(data: DebtCreate, db: Session = Annotated[Depends(get_db)]):
    return svc.create_debt(db, data)


@router.patch("/{debt_id}", response_model=Debt)
def update_debt(debt_id: int, data: DebtUpdate, db: Session = Annotated[Depends(get_db)]):
    row = svc.update_debt(db, debt_id, data)
    if not row:
        raise HTTPException(status_code=404, detail="Debt not found")
    return row


@router.delete("/{debt_id}", status_code=204)
def delete_debt(debt_id: int, db: Session = Annotated[Depends(get_db)]):
    if not svc.delete_debt(db, debt_id):
        raise HTTPException(status_code=404, detail="Debt not found")
