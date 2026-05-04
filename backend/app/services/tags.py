from sqlalchemy.orm import Session
from app.models.tag import Tag
from app.schemas.tag import TagCreate


def get_tags(db: Session) -> list[Tag]:
    return db.query(Tag).order_by(Tag.name).all()


def get_tag(db: Session, tag_id: int) -> Tag | None:
    return db.query(Tag).filter(Tag.id == tag_id).first()


def create_tag(db: Session, data: TagCreate) -> Tag:
    row = Tag(**data.model_dump())
    db.add(row)
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
