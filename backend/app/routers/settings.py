from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.settings import Settings, SettingsUpdate
import app.services.settings as svc

router = APIRouter(prefix="/settings", tags=["settings"])

SETTINGS_NOT_FOUND = "Settings not found"


@router.get("", response_model=Settings, responses={404: {"description": SETTINGS_NOT_FOUND}})
def read_settings(db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_settings(db)
    if not row:
        raise HTTPException(status_code=404, detail=SETTINGS_NOT_FOUND)
    return row


@router.patch("", response_model=Settings, responses={404: {"description": SETTINGS_NOT_FOUND}})
def update_settings(data: SettingsUpdate, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.update_settings(db, data)
    if not row:
        raise HTTPException(status_code=404, detail=SETTINGS_NOT_FOUND)
    return row
