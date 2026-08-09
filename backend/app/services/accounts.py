from app.models.account import Account, AccountCreate, AccountUpdate
from app.models.wallet import Wallet
from sqlalchemy.orm import Session

VALID_ACCOUNT_TYPES = ["checking", "savings", "credit_card"]


def get_accounts(db: Session, account_type: str) -> list[Account]:
    if account_type is not None:
        if account_type in VALID_ACCOUNT_TYPES:
            q = db.query(Account).filter(Account.type == account_type)
        else:
            raise ValueError(
                f"Invalid query param for account_type. Must be one of: {VALID_ACCOUNT_TYPES}"
            )
    else:
        q = db.query(Account)
    return q.order_by(Account.name).all()


def get_account(db: Session, account_id: int) -> Account | None:
    q = db.query(Account).filter(Account.id == account_id)

    return q.first()


def create_account(db: Session, data: AccountCreate) -> Account:
    row = Account(**data.model_dump())
    if data.type not in VALID_ACCOUNT_TYPES:
        raise ValueError(f"Invalid account type. Must be one of: {VALID_ACCOUNT_TYPES}")

    if db.get(Wallet, data.wallet_id) is None:
        raise ValueError(f"Invalid wallet_id. Wallet {data.wallet_id} does not exist.")

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
