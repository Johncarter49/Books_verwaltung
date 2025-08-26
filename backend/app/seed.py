from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from .models import Book


def seed_if_empty(db: Session) -> None:
    count = db.query(Book).count()
    if count > 0:
        return

    now = datetime.utcnow()
    samples = [
        Book(title="Der Prozess", author="Franz Kafka", created_at=now - timedelta(days=10), created_by="admin"),
        Book(title="Faust", author="Johann Wolfgang von Goethe", created_at=now - timedelta(days=5), created_by="admin"),
        Book(title="Die Verwandlung", author="Franz Kafka", created_at=now - timedelta(days=2), created_by="admin"),
        Book(title="Die Physiker", author="Friedrich Dürrenmatt", created_at=now - timedelta(days=1), created_by="editor"),
    ]
    db.add_all(samples)
    db.commit()


