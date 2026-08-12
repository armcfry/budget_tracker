from sqlalchemy import ForeignKey
from sqlmodel import Column, Field, SQLModel


class TransactionTag(SQLModel, table=True):
    __tablename__ = "transaction_tags"

    transaction_id: int = Field(
        sa_column=Column(
            ForeignKey("transactions.id", ondelete="CASCADE"), primary_key=True
        )
    )
    tag_id: int = Field(
        sa_column=Column(ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
    )
