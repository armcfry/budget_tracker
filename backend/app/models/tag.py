from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.transaction_tag import transaction_tags


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transactions = relationship("Transaction", secondary=transaction_tags, back_populates="tags")
