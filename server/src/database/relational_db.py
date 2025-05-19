from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from datetime import datetime

from src.database.models.base import Base


# database.py

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
    
    # def __init__(self, db_url: str = "sqlite:///./test.db"):
    #     self.engine = create_engine(
    #         db_url,
    #         connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
    #     )
    #     self.SessionLocal = sessionmaker(bind=self.engine)
    #     self._create_tables()

    def _create_tables(self):
        Base.metadata.create_all(bind=self.engine)

    def add(self, instance):
        try:

            self.session.add(instance)
            self.session.commit()
        except:
            self.session.rollback()

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
        except:
            self.session.rollback()

    def soft_delete(self, model, id_):
        try:
            obj = self.session.query(model).filter(model.id == id_).first()
            if not obj:
                return None
            obj.deleted_at = datetime.utcnow()
            self.session.commit()
            return obj
        except:
            self.session.rollback()

    def delete(self, instance):
        try:
            self.session.delete(instance)
            self.session.commit()
        except:
            self.session.rollback()

    def get_session(self):
        return self.session



# from db.database import Database
# from db.models import User

# db = Database()

# # Add user
# db.add(User(name="Alice", email="alice@example.com"))

# # Get all users
# users = db.get_all(User)
# for user in users:
#     print(user.id, user.name, user.email)

# # Update user
# db.update(User, id_=1, name="Alice Updated")

# # Get by ID
# user = db.get_by_id(User, 1)
# print(user.name)

# # Delete
# db.delete(user)
