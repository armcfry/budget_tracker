from sqlalchemy.orm import Session
from app.models.recurring_transaction import RecurringTransaction
from app.schemas.recurring_transaction import RecurringTransactionCreate, RecurringTransactionUpdate


def get_recurring_transactions(db: Session, active_only: bool = True) -> list[RecurringTransaction]:
    q = db.query(RecurringTransaction)
    if active_only:
        q = q.filter(RecurringTransaction.is_active == True)
    return q.order_by(RecurringTransaction.title).all()


def get_recurring_transaction(db: Session, rt_id: int) -> RecurringTransaction | None:
    return db.query(RecurringTransaction).filter(RecurringTransaction.id == rt_id).first()


def create_recurring_transaction(db: Session, data: RecurringTransactionCreate) -> RecurringTransaction:
    row = RecurringTransaction(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_recurring_transaction(db: Session, rt_id: int, data: RecurringTransactionUpdate) -> RecurringTransaction | None:
    row = get_recurring_transaction(db, rt_id)
    if not row:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_recurring_transaction(db: Session, rt_id: int) -> bool:
    row = get_recurring_transaction(db, rt_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
