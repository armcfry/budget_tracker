from sqlalchemy.orm import Session
from app.models.settings import Settings
from app.schemas.settings import SettingsUpdate


def get_settings(db: Session) -> Settings | None:
    return db.query(Settings).first()


def update_settings(db: Session, data: SettingsUpdate) -> Settings:
    row = db.query(Settings).first()
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row
