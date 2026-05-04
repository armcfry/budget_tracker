from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.monthly_budget import MonthlyBudget, MonthlyBudgetCreate, MonthlyBudgetUpdate
import app.services.monthly_budgets as svc

router = APIRouter(prefix="/monthly-budgets", tags=["monthly-budgets"])

MONTHLY_BUDGET_NOT_FOUND = "Monthly budget not found"


@router.get("", response_model=list[MonthlyBudget])
def list_monthly_budgets(
    year: Annotated[int | None, Query()] = None,
    month: Annotated[int | None, Query()] = None,
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_monthly_budgets(db, year, month)


@router.get("/{budget_id}", response_model=MonthlyBudget, responses={404: {"description": MONTHLY_BUDGET_NOT_FOUND}})
def get_monthly_budget(budget_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_monthly_budget(db, budget_id)
    if not row:
        raise HTTPException(status_code=404, detail=MONTHLY_BUDGET_NOT_FOUND)
    return row


@router.post("", response_model=MonthlyBudget, status_code=201)
def create_monthly_budget(data: MonthlyBudgetCreate, db: Annotated[Session, Depends(get_db)] = None):
    return svc.create_monthly_budget(db, data)


@router.patch("/{budget_id}", response_model=MonthlyBudget, responses={404: {"description": MONTHLY_BUDGET_NOT_FOUND}})
def update_monthly_budget(
    budget_id: int,
    data: MonthlyBudgetUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_monthly_budget(db, budget_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=MONTHLY_BUDGET_NOT_FOUND)
    return row


@router.delete("/{budget_id}", status_code=204, responses={404: {"description": MONTHLY_BUDGET_NOT_FOUND}})
def delete_monthly_budget(budget_id: int, db: Annotated[Session, Depends(get_db)] = None):
    if not svc.delete_monthly_budget(db, budget_id):
        raise HTTPException(status_code=404, detail=MONTHLY_BUDGET_NOT_FOUND)
