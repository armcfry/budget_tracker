from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.budget_template import BudgetTemplate, BudgetTemplateCreate, BudgetTemplateUpdate
import app.services.budget_templates as svc

router = APIRouter(prefix="/budget-templates", tags=["budget-templates"])

BUDGET_TEMPLATE_NOT_FOUND = "Budget template not found"


@router.get("", response_model=list[BudgetTemplate])
def list_budget_templates(
    active_only: Annotated[bool, Query()] = True,
    db: Annotated[Session, Depends(get_db)] = None,
):
    return svc.get_budget_templates(db, active_only)


@router.get("/{template_id}", response_model=BudgetTemplate, responses={404: {"description": BUDGET_TEMPLATE_NOT_FOUND}})
def get_budget_template(template_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_budget_template(db, template_id)
    if not row:
        raise HTTPException(status_code=404, detail=BUDGET_TEMPLATE_NOT_FOUND)
    return row


@router.post("", response_model=BudgetTemplate, status_code=201)
def create_budget_template(data: BudgetTemplateCreate, db: Annotated[Session, Depends(get_db)] = None):
    return svc.create_budget_template(db, data)


@router.patch("/{template_id}", response_model=BudgetTemplate, responses={404: {"description": BUDGET_TEMPLATE_NOT_FOUND}})
def update_budget_template(
    template_id: int,
    data: BudgetTemplateUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_budget_template(db, template_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=BUDGET_TEMPLATE_NOT_FOUND)
    return row


@router.delete("/{template_id}", status_code=204, responses={404: {"description": BUDGET_TEMPLATE_NOT_FOUND}})
def delete_budget_template(template_id: int, db: Annotated[Session, Depends(get_db)] = None):
    if not svc.delete_budget_template(db, template_id):
        raise HTTPException(status_code=404, detail=BUDGET_TEMPLATE_NOT_FOUND)
