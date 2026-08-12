from app.models.account import Account, AccountCreate, AccountUpdate
from app.models.transaction import Transaction
from app.models.wallet import Wallet
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlmodel import func

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
    # get account by id
    account = db.get(Account, account_id)
    if account is None:
        return None

    #  calculate the sum of related transactions
    stmt = select(func.coalesce(func.sum(Transaction.amount), 0)).where(
        Transaction.account_id == account_id
    )
    balance = db.scalar(stmt)
    account.balance = balance

    # update the account balance in the database
    db.add(account)
    db.commit()
    db.refresh(account)

    return account


def create_account(db: Session, data: AccountCreate) -> Account:
    account = Account(**data.model_dump())
    if data.type not in VALID_ACCOUNT_TYPES:
        raise ValueError(f"Invalid account type. Must be one of: {VALID_ACCOUNT_TYPES}")

    if db.get(Wallet, data.wallet_id) is None:
        raise ValueError(f"Invalid wallet_id. Wallet {data.wallet_id} does not exist.")

    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def update_account(db: Session, account_id: int, data: AccountUpdate) -> Account | None:
    account = get_account(db, account_id)
    if not account:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(account, field, value)
    db.commit()
    db.refresh(account)
    return account


def delete_account(db: Session, account_id: int) -> bool:
    account = get_account(db, account_id)
    if not account:
        return False
    db.delete(account)
    db.commit()
    return True
