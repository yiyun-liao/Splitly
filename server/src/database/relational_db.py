from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from datetime import datetime

from src.database.models.base import Base


# relational_db.py

class Database:
    def __init__(
        self,
        db_url: str = "sqlite:///:memory:",
        verbose: bool = False,
    ) -> None:
        """
        Initialize the database connection.

        Args:
            db_url (str, optional): The database URL to connect to.
                Defaults to an in-memory SQLite database.
            verbose (bool, optional): Whether to echo SQL statements. Defaults to False.
        """
        self.db_url = db_url
        self.engine = (
            create_engine(db_url, echo=True, future=True)
            if verbose
            else create_engine(db_url, future=True)
        )

        # Migrate models during initialization here
        self._create_tables()
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()
    

    def _create_tables(self):
        Base.metadata.create_all(bind=self.engine)

    def add(self, instance):
        try:
            self.session.add(instance)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e

    def get_all(self, model, include_deleted=False):
        query = self.session.query(model)
        if not include_deleted and hasattr(model, "deleted_at"):
            query = query.filter(model.deleted_at.is_(None))
        return query.all()

    def get_by_id(self, model, id_, include_deleted=False):
        query = self.session.query(model).filter(model.id == id_)
        if not include_deleted and hasattr(model, "deleted_at"):
            query = query.filter(model.deleted_at.is_(None))
        return query.first()

    def update(self, model, id_, **kwargs):
        try:
            obj = self.session.query(model).filter(model.id == id_).first()
            if not obj:
                return None
            for key, value in kwargs.items():
                setattr(obj, key, value)
            self.session.commit()
            return obj
        except Exception as e:
            self.session.rollback()
            raise e

    def soft_delete(self, model, id_):
        try:
            obj = self.session.query(model).filter(model.id == id_).first()
            if not obj:
                return None
            obj.deleted_at = datetime.utcnow()
            self.session.commit()
            return obj
        except Exception as e:
            self.session.rollback()
            raise e

    def delete(self, instance):
        try:
            self.session.delete(instance)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise e

    def get_session(self):
        return self.session


