from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.monthly_budget import MonthlyBudget, MonthlyBudgetCreate, MonthlyBudgetUpdate
import app.services.monthly_budgets as svc

router = APIRouter(prefix="/monthly-budgets", tags=["monthly-budgets"])


@router.get("", response_model=list[MonthlyBudget])
def list_monthly_budgets(
    year: int | None = Query(None),
    month: int | None = Query(None),
    db: Session = Depends(get_db),
):
    return svc.get_monthly_budgets(db, year, month)


@router.get("/{budget_id}", response_model=MonthlyBudget)
def get_monthly_budget(budget_id: int, db: Session = Depends(get_db)):
    row = svc.get_monthly_budget(db, budget_id)
    if not row:
        raise HTTPException(status_code=404, detail="Monthly budget not found")
    return row


@router.post("", response_model=MonthlyBudget, status_code=201)
def create_monthly_budget(data: MonthlyBudgetCreate, db: Session = Depends(get_db)):
    return svc.create_monthly_budget(db, data)


@router.patch("/{budget_id}", response_model=MonthlyBudget)
def update_monthly_budget(budget_id: int, data: MonthlyBudgetUpdate, db: Session = Depends(get_db)):
    row = svc.update_monthly_budget(db, budget_id, data)
    if not row:
        raise HTTPException(status_code=404, detail="Monthly budget not found")
    return row


@router.delete("/{budget_id}", status_code=204)
def delete_monthly_budget(budget_id: int, db: Session = Depends(get_db)):
    if not svc.delete_monthly_budget(db, budget_id):
        raise HTTPException(status_code=404, detail="Monthly budget not found")
