import re

from app.models.tag import Tag, TagCreate, TagUpdate
from sqlalchemy.orm import Session

COLOR_REGEX = r"^#(?:[0-9a-fA-F]{3}){1,2}$"

def get_tags(db: Session) -> list[Tag]:
    return db.query(Tag).order_by(Tag.id).all()


def get_tag(db: Session, tag_id: int) -> Tag | None:
    return db.query(Tag).filter(Tag.id == tag_id).first()


def create_tag(db: Session, data: TagCreate) -> Tag:
    row = Tag(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return row

def update_tag(db: Session, tag_id: int, data: TagUpdate) -> Tag | None:
    row = get_tag(db, tag_id)
    if not row:
        return None
    if data.color is not None and not re.match(COLOR_REGEX, data.color):
        raise ValueError("Invalid color format. Must be a valid hex color code.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row

def delete_tag(db: Session, tag_id: int) -> bool:
    row = get_tag(db, tag_id)
    if not row:
        return False
    db.delete(row)
    db.commit()
    return True
