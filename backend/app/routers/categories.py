from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.category import Category, CategoryCreate, CategoryUpdate
import app.services.categories as svc

router = APIRouter(prefix="/categories", tags=["categories"])

CATEGORY_NOT_FOUND = "Category not found"


@router.get("", response_model=list[Category])
def list_categories(db: Annotated[Session, Depends(get_db)] = None):
    return svc.get_categories(db)


@router.get("/{category_id}", response_model=Category, responses={404: {"description": CATEGORY_NOT_FOUND}})
def get_category(category_id: int, db: Annotated[Session, Depends(get_db)] = None):
    row = svc.get_category(db, category_id)
    if not row:
        raise HTTPException(status_code=404, detail=CATEGORY_NOT_FOUND)
    return row


@router.post("", response_model=Category, status_code=201)
def create_category(data: CategoryCreate, db: Annotated[Session, Depends(get_db)] = None):
    return svc.create_category(db, data)


@router.patch("/{category_id}", response_model=Category, responses={404: {"description": CATEGORY_NOT_FOUND}})
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Annotated[Session, Depends(get_db)] = None,
):
    row = svc.update_category(db, category_id, data)
    if not row:
        raise HTTPException(status_code=404, detail=CATEGORY_NOT_FOUND)
    return row


@router.delete("/{category_id}", status_code=204, responses={404: {"description": CATEGORY_NOT_FOUND}})
def delete_category(category_id: int, db: Annotated[Session, Depends(get_db)] = None):
    if not svc.delete_category(db, category_id):
        raise HTTPException(status_code=404, detail=CATEGORY_NOT_FOUND)
