from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.category import (
    CategorySchema,
    CategoryOutSchema,
    CategoryCreateSchema,
)
from src.database.category_db import get_all_categories, create_category
from src.database.relational_db import Database

class CategoryRouter:
    def __init__(self, db: Database):
        self.router = APIRouter(prefix="/api/category", tags=["Category"])
        self.db = db
        self._add_routes()

    def _add_routes(self):
        @self.router.get("", response_model=list[CategoryOutSchema])
        def get_categories():
            db_session: Session = self.db.get_session()
            return get_all_categories(db_session)

        @self.router.post("", response_model=CategoryOutSchema)
        def create_new_category(category: CategoryCreateSchema):
            db_session: Session = self.db.get_session()
            return create_category(db_session, category)
