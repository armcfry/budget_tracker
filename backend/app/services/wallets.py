from app.models.wallet import Wallet, WalletCreate, WalletUpdate
from sqlalchemy.orm import Session


def get_wallets(db: Session) -> list[Wallet]:
    q = db.query(Wallet)
    return q.order_by(Wallet.name).all()


def get_wallet(db: Session, wallet_id: int) -> Wallet | None:
    return db.query(Wallet).filter(Wallet.id == wallet_id).first()


def create_wallet(db: Session, data: WalletCreate) -> Wallet:
    wallet = Wallet(**data.model_dump())
    db.add(wallet)
    db.commit()
    db.refresh(wallet)
    return wallet


def update_wallet(db: Session, wallet_id: int, data: WalletUpdate) -> Wallet | None:
    wallet = get_wallet(db, wallet_id)
    if not wallet:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(wallet, field, value)
    db.commit()
    db.refresh(wallet)
    return wallet


def delete_wallet(db: Session, wallet_id: int) -> bool:
    wallet = get_wallet(db, wallet_id)
    if not wallet:
        return False
    db.delete(wallet)
    db.commit()
    return True
