from app.db.session import Base
from sqlalchemy import Column, Integer, String


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    color = Column(String(7), nullable=False, default="#000000")  # Default color is black
    created_at = Column(String(100), nullable=False, server_default="CURRENT_TIMESTAMP")
