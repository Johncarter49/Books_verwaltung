from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    author: str = Field(..., min_length=1, max_length=255)
    created_by: str = Field(..., min_length=1, max_length=255)


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author: Optional[str] = Field(None, min_length=1, max_length=255)
    created_by: Optional[str] = Field(None, min_length=1, max_length=255)


class BookOut(BookBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


