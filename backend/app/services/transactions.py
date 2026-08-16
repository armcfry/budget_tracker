from datetime import date

from sqlalchemy import select

from app.models.account import Account
from app.models.tag import Tag
from app.models.transaction import Transaction, TransactionCreate, TransactionUpdate
from sqlalchemy.orm import Session, joinedload


def _resolve_tags(db: Session, tags: list[str]) -> list[Tag]:
    """Look up tags by name, creating any that don't exist yet."""
    if not tags:
        return []

    existing = db.query(Tag).filter(Tag.name.in_(tags)).all()
    existing_names = {t.name for t in existing}

    new_tags = [Tag(name=name) for name in tags if name not in existing_names]
    if new_tags:
        db.add_all(new_tags)
        db.flush()  # assigns ids to new_tags without committing yet

    return existing + new_tags


def get_transactions(
    db: Session,
    date: date = None,
    tags: list[str] = None,
    amount_min: float = None,
    amount_max: float = None,
) -> list[Transaction]:

    stmt = select(Transaction)
    conditions = []

    print("here")
    if date is not None:
        conditions.append(Transaction.date_value == date)
        print(date)

    if tags:
        conditions.append(Transaction.tags.any(Tag.name.in_(tags)))

    if amount_min is not None:
        conditions.append(Transaction.amount >= amount_min)

    if amount_max is not None:
        conditions.append(Transaction.amount <= amount_max)

    if conditions:
        stmt = stmt.where(*conditions)

    stmt = stmt.order_by(Transaction.date_value)

    return db.execute(stmt).scalars().all()


def get_transaction(db: Session, transaction_id: int) -> Transaction | None:
    return (
        db.query(Transaction)
        .options(joinedload(Transaction.tags))
        .filter(Transaction.id == transaction_id)
        .first()
    )


def create_transaction(db: Session, data: TransactionCreate) -> Transaction:
    tag_names = data.tags
    transaction = Transaction(**data.model_dump(exclude={"tags"}))
    if tag_names:
        transaction.tags = _resolve_tags(db, tag_names)

    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def update_transaction(
    db: Session, transaction_id: int, data: TransactionUpdate
) -> Transaction | None:
    transaction = get_transaction(db, transaction_id)
    if not transaction:
        return None
    payload = data.model_dump(exclude_unset=True)
    tag_names = payload.pop("tags", None)

    for field, value in payload.items():
        setattr(transaction, field, value)

    if tag_names is not None:
        transaction.tags = _resolve_tags(db, tag_names)

    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction_id: int) -> bool:
    transaction = get_transaction(db, transaction_id)
    if not transaction:
        return False
    db.delete(transaction)
    db.commit()
    return True
