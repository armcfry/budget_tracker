from sqlalchemy.orm import Session
from app.models.monthly_budget import MonthlyBudget
from app.schemas.monthly_budget import MonthlyBudgetCreate, MonthlyBudgetUpdate


def get_monthly_budgets(db: Session, year: int | None = None, month: int | None = None) -> list[MonthlyBudget]:
    q = db.query(MonthlyBudget)
    if year:
        q = q.filter(MonthlyBudget.year == year)
    if month:
        q = q.filter(MonthlyBudget.month == month)
    return q.all()


def get_monthly_budget(db: Session, budget_id: int) -> MonthlyBudget | None:
    return db.query(MonthlyBudget).filter(MonthlyBudget.id == budget_id).first()


def create_monthly_budget(db: Session, data: MonthlyBudgetCreate) -> MonthlyBudget:
    row = MonthlyBudget(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_monthly_budget(db: Session, budget_id: int, data: MonthlyBudgetUpdate) -> MonthlyBudget | None:
    row = get_monthly_budget(db, budget_id)
    if not row:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_monthly_budget(db: Session, budget_id: int) -> bool:
    row = get_monthly_budget(db, budget_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
