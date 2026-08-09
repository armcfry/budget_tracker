from app.db.session import Base
from sqlalchemy import Column, ForeignKey, Integer, Table

# many to many relationship between transactions and tags
transaction_tags = Table(
    "transaction_tags",
    Base.metadata,
    Column(
        "transaction_id",
        Integer,
        ForeignKey("transactions.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True
    ),
)
