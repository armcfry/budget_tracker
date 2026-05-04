from sqlalchemy.orm import Session
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountUpdate


def get_accounts(db: Session, active_only: bool = True) -> list[Account]:
    q = db.query(Account)
    if active_only:
        q = q.filter(Account.is_active.is_(True))
    return q.order_by(Account.name).all()


def get_account(db: Session, account_id: int) -> Account | None:
    return db.query(Account).filter(Account.id == account_id).first()


def create_account(db: Session, data: AccountCreate) -> Account:
    row = Account(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_account(db: Session, account_id: int, data: AccountUpdate) -> Account | None:
    row = get_account(db, account_id)
    if not row:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_account(db: Session, account_id: int) -> bool:
    row = get_account(db, account_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
