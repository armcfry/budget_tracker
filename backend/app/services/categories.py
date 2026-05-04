from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def get_categories(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.name).all()


def get_category(db: Session, category_id: int) -> Category | None:
    return db.query(Category).filter(Category.id == category_id).first()


def create_category(db: Session, data: CategoryCreate) -> Category:
    row = Category(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def update_category(db: Session, category_id: int, data: CategoryUpdate) -> Category | None:
    row = get_category(db, category_id)
    if not row:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


def delete_category(db: Session, category_id: int) -> bool:
    row = get_category(db, category_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
