from datetime import datetime
from typing import Optional

from sqlalchemy import CHAR, Column, DateTime
from sqlmodel import Field, SQLModel


class TagBase(SQLModel):
    name: str = Field(unique=True)
    color: Optional[str] = Field(sa_column=Column(CHAR(7)), default="#000000")


class Tag(TagBase, table=True):
    __tablename__ = "tags"

    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(
        default=None, sa_column=Column(DateTime(timezone=True))
    )  # DB fills this via server default


class TagCreate(TagBase):
    pass


class TagUpdate(SQLModel):
    name: Optional[str] = None
    color: Optional[str] = None
