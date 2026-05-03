from sqlalchemy.orm import Session
from app.models.budget_template import BudgetTemplate
from app.schemas.budget_template import BudgetTemplateCreate, BudgetTemplateUpdate


def get_budget_templates(db: Session, active_only: bool = True) -> list[BudgetTemplate]:
    q = db.query(BudgetTemplate)
    if active_only:
        q = q.filter(BudgetTemplate.is_active == True)
    return q.all()


def get_budget_template(db: Session, template_id: int) -> BudgetTemplate | None:
    return db.query(BudgetTemplate).filter(BudgetTemplate.id == template_id).first()


def create_budget_template(db: Session, data: BudgetTemplateCreate) -> BudgetTemplate:
    row = BudgetTemplate(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_budget_template(db: Session, template_id: int, data: BudgetTemplateUpdate) -> BudgetTemplate | None:
    row = get_budget_template(db, template_id)
    if not row:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_budget_template(db: Session, template_id: int) -> bool:
    row = get_budget_template(db, template_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
