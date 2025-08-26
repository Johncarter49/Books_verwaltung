from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from . import models, schemas
from .database import Base, engine, get_db, SessionLocal
from .crud import (
    get_books,
    get_book_by_id,
    create_book,
    update_book,
    delete_book,
)
from sqlalchemy.orm import Session
from .seed import seed_if_empty


app = FastAPI(title="Bücher API", version="1.0.0")

# CORS – während der Entwicklung alles erlauben; in Produktion einschränken
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/health", tags=["health"])  # einfacher Healthcheck
def health() -> dict:
    return {"status": "ok"}


@app.get("/books", response_model=List[schemas.BookOut], tags=["books"])
def list_books(
    q: Optional[str] = Query(default=None, description="Suche nach Titel/Autor"),
    created_from: Optional[datetime] = Query(default=None),
    created_to: Optional[datetime] = Query(default=None),
    db: Session = Depends(get_db),
):
    return get_books(db=db, query=q, created_from=created_from, created_to=created_to)


@app.get("/books/{book_id}", response_model=schemas.BookOut, tags=["books"])
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@app.post("/books", response_model=schemas.BookOut, status_code=201, tags=["books"])
def create_book_endpoint(payload: schemas.BookCreate, db: Session = Depends(get_db)):
    return create_book(db=db, book_in=payload)


@app.put("/books/{book_id}", response_model=schemas.BookOut, tags=["books"])
def update_book_endpoint(book_id: int, payload: schemas.BookUpdate, db: Session = Depends(get_db)):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return update_book(db=db, db_book=book, book_in=payload)


@app.delete("/books/{book_id}", status_code=204, tags=["books"])
def delete_book_endpoint(book_id: int, db: Session = Depends(get_db)):
    book = get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    delete_book(db=db, db_book=book)
    return None


