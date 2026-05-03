from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.tag import Tag, TagCreate
import app.services.tags as svc

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=list[Tag])
def list_tags(db: Session = Annotated[Depends(get_db)]):
    return svc.get_tags(db)


@router.post("", response_model=Tag, status_code=201)
def create_tag(data: TagCreate, db: Session = Annotated[Depends(get_db)]):
    return svc.create_tag(db, data)


@router.delete("/{tag_id}", status_code=204)
def delete_tag(tag_id: int, db: Session = Annotated[Depends(get_db)]):
    if not svc.delete_tag(db, tag_id):
        raise HTTPException(status_code=404, detail="Tag not found")
