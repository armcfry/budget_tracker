from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.budget_template import BudgetTemplate, BudgetTemplateCreate, BudgetTemplateUpdate
import app.services.budget_templates as svc

router = APIRouter(prefix="/budget-templates", tags=["budget-templates"])


@router.get("", response_model=list[BudgetTemplate])
def list_budget_templates(active_only: bool = Query(True), db: Session = Depends(get_db)):
    return svc.get_budget_templates(db, active_only)


@router.get("/{template_id}", response_model=BudgetTemplate)
def get_budget_template(template_id: int, db: Session = Depends(get_db)):
    row = svc.get_budget_template(db, template_id)
    if not row:
        raise HTTPException(status_code=404, detail="Budget template not found")
    return row


@router.post("", response_model=BudgetTemplate, status_code=201)
def create_budget_template(data: BudgetTemplateCreate, db: Session = Depends(get_db)):
    return svc.create_budget_template(db, data)


@router.patch("/{template_id}", response_model=BudgetTemplate)
def update_budget_template(template_id: int, data: BudgetTemplateUpdate, db: Session = Depends(get_db)):
    row = svc.update_budget_template(db, template_id, data)
    if not row:
        raise HTTPException(status_code=404, detail="Budget template not found")
    return row


@router.delete("/{template_id}", status_code=204)
def delete_budget_template(template_id: int, db: Session = Depends(get_db)):
    if not svc.delete_budget_template(db, template_id):
        raise HTTPException(status_code=404, detail="Budget template not found")
