from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.session import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    color = Column(String(7))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
