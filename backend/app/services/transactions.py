from datetime import date
from sqlalchemy.orm import Session, joinedload
from app.models.transaction import Transaction
from app.models.tag import Tag
from app.schemas.transaction import TransactionCreate, TransactionUpdate


def get_transactions(
    db: Session,
    start_date: date | None = None,
    end_date: date | None = None,
    account_id: int | None = None,
    category_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Transaction]:
    q = db.query(Transaction).options(joinedload(Transaction.tags))
    if start_date:
        q = q.filter(Transaction.date >= start_date)
    if end_date:
        q = q.filter(Transaction.date <= end_date)
    if account_id:
        q = q.filter(Transaction.account_id == account_id)
    if category_id:
        q = q.filter(Transaction.category_id == category_id)
    return q.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()


def get_transaction(db: Session, transaction_id: int) -> Transaction | None:
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.tags))
        .filter(Transaction.id == transaction_id)
        .first()
    )


def create_transaction(db: Session, data: TransactionCreate) -> Transaction:
    tag_ids = data.tag_ids
    row = Transaction(**data.model_dump(exclude={"tag_ids"}))
    if tag_ids:
        row.tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_transaction(db: Session, transaction_id: int, data: TransactionUpdate) -> Transaction | None:
    row = get_transaction(db, transaction_id)
    if not row:
        return None
    payload = data.model_dump(exclude_unset=True)
    tag_ids = payload.pop("tag_ids", None)
    for field, value in payload.items():
        setattr(row, field, value)
    if tag_ids is not None:
        row.tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    db.commit()
    db.refresh(row)
    return row


def delete_transaction(db: Session, transaction_id: int) -> bool:
    row = get_transaction(db, transaction_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
