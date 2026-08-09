from app.models.wallet import Wallet, WalletCreate, WalletUpdate
from sqlalchemy.orm import Session


def get_wallets(db: Session) -> list[Wallet]:
    q = db.query(Wallet)
    return q.order_by(Wallet.name).all()


def get_wallet(db: Session, wallet_id: int) -> Wallet | None:
    return db.query(Wallet).filter(Wallet.id == wallet_id).first()


def create_wallet(db: Session, data: WalletCreate) -> Wallet:
    row = Wallet(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_wallet(db: Session, wallet_id: int, data: WalletUpdate) -> Wallet | None:
    row = get_wallet(db, wallet_id)
    if not row:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_wallet(db: Session, wallet_id: int) -> bool:
    row = get_wallet(db, wallet_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
