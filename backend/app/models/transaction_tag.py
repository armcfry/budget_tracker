from sqlalchemy import Table, Column, Integer, ForeignKey
from app.db.session import Base

transaction_tags = Table(
    "transaction_tags",
    Base.metadata,
    Column("transaction_id", Integer, ForeignKey("transactions.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)
