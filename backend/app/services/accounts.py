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

    accounts = q.order_by(Account.name).all()  # SELECT * FROM accounts [WHERE type = :type] ORDER BY name;

    _recompute_balances(db, accounts)
    db.commit()

    for account in accounts:
        db.refresh(account)  # optional -- drop if nothing server-side needs syncing

    return accounts


def get_account(db: Session, account_id: int) -> Account | None:
    account = _get_account_raw(db, account_id)
    if account is None:
        return None

    _recompute_balances(db, [account])
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
    account = _get_account_raw(db, account_id)
    if account is None:
        return None

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(account, field, value)

    db.commit()  # one commit covers both the field updates and the balance recompute
    db.refresh(account)
    return account


def delete_account(db: Session, account_id: int) -> bool:
    account = _get_account_raw(db, account_id)
    if account is None:
        return False

    db.delete(account)
    db.commit()
    return True

def _get_account_raw(db: Session, account_id: int) -> Account | None:
    # Plain fetch, no side effects. SQL: SELECT * FROM accounts WHERE id = :account_id;
    return db.get(Account, account_id)

def _recompute_balances(db: Session, accounts: list[Account]) -> None:
    # Sums transactions for ALL given accounts in one query, then writes
    # the result onto each account. Does NOT commit -- caller decides when.
    account_ids = [a.id for a in accounts]
    if not account_ids:
        return

    stmt = (
        select(Transaction.account_id, func.coalesce(func.sum(Transaction.amount), 0))
        .where(Transaction.account_id.in_(account_ids))
        .group_by(Transaction.account_id)
    )
    balances = dict(db.execute(stmt).all())  # {account_id: balance, ...}

    for account in accounts:
        account.balance = balances.get(account.id, 0)  # 0 for accounts with no transactions
