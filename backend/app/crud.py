from datetime import datetime
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas


def get_books(
    db: Session,
    query: Optional[str] = None,
    created_from: Optional[datetime] = None,
    created_to: Optional[datetime] = None,
) -> List[models.Book]:
    statement = select(models.Book)
    if query:
        like_term = f"%{query.lower()}%"
        statement = statement.where(
            (models.Book.title.ilike(like_term)) | (models.Book.author.ilike(like_term))
        )
    if created_from:
        statement = statement.where(models.Book.created_at >= created_from)
    if created_to:
        statement = statement.where(models.Book.created_at <= created_to)
    statement = statement.order_by(models.Book.created_at.desc(), models.Book.id.desc())
    return list(db.execute(statement).scalars().all())


def get_book_by_id(db: Session, book_id: int) -> Optional[models.Book]:
    return db.get(models.Book, book_id)


def create_book(db: Session, book_in: schemas.BookCreate) -> models.Book:
    db_book = models.Book(
        title=book_in.title,
        author=book_in.author,
        created_by=book_in.created_by,
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, db_book: models.Book, book_in: schemas.BookUpdate) -> models.Book:
    if book_in.title is not None:
        db_book.title = book_in.title
    if book_in.author is not None:
        db_book.author = book_in.author
    if book_in.created_by is not None:
        db_book.created_by = book_in.created_by
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, db_book: models.Book) -> None:
    db.delete(db_book)
    db.commit()


