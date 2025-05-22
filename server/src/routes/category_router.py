from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.category import (
    CategorySchema,
    CategoryOutSchema,
)
from src.database.category_db import CategoryDB
from src.database.relational_db import Database

class CategoryRouter:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db
        self._add_routes()

    def _add_routes(self):
        @self.router.get("/api/category", response_model=list[CategoryOutSchema])
        def get_categories():
            db_session: Session = self.db.get_session()
            return CategoryDB.get_all_categories(db_session)

        @self.router.get("/api/category", response_model=list[CategoryOutSchema])
        def get_categories():
            db_session: Session = self.db.get_session()
            return CategoryDB.get_all_categories_nest(db_session)

        @self.router.post("/api/category-nest", response_model=CategoryOutSchema)
        def create_new_category(category: CategorySchema):
            db_session: Session = self.db.get_session()
            return CategoryDB.create_category(db_session, category)
