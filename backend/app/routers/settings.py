from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.settings import Settings, SettingsUpdate
import app.services.settings as svc

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=Settings)
def read_settings(db: Session = Annotated[Depends(get_db)]):
    row = svc.get_settings(db)
    if not row:
        raise HTTPException(status_code=404, detail="Settings not found")
    return row


@router.patch("", response_model=Settings)
def update_settings(data: SettingsUpdate, db: Session = Annotated[Depends(get_db)]):
    return svc.update_settings(db, data)
