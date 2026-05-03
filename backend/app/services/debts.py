from sqlalchemy.orm import Session
from app.models.debt import Debt
from app.schemas.debt import DebtCreate, DebtUpdate


def get_debts(db: Session, active_only: bool = True) -> list[Debt]:
    q = db.query(Debt)
    if active_only:
        q = q.filter(Debt.is_active == True)
    return q.order_by(Debt.name).all()


def get_debt(db: Session, debt_id: int) -> Debt | None:
    return db.query(Debt).filter(Debt.id == debt_id).first()


def create_debt(db: Session, data: DebtCreate) -> Debt:
    row = Debt(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_debt(db: Session, debt_id: int, data: DebtUpdate) -> Debt | None:
    row = get_debt(db, debt_id)
    if not row:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_debt(db: Session, debt_id: int) -> bool:
    row = get_debt(db, debt_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
