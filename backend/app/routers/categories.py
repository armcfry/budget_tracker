from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.category import Category, CategoryCreate, CategoryUpdate
import app.services.categories as svc

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[Category])
def list_categories(db: Session = Depends(get_db)):
    return svc.get_categories(db)


@router.get("/{category_id}", response_model=Category)
def get_category(category_id: int, db: Session = Depends(get_db)):
    row = svc.get_category(db, category_id)
    if not row:
        raise HTTPException(status_code=404, detail="Category not found")
    return row


@router.post("", response_model=Category, status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return svc.create_category(db, data)


@router.patch("/{category_id}", response_model=Category)
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    row = svc.update_category(db, category_id, data)
    if not row:
        raise HTTPException(status_code=404, detail="Category not found")
    return row


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    if not svc.delete_category(db, category_id):
        raise HTTPException(status_code=404, detail="Category not found")
