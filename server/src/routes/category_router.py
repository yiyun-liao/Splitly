#server/src/routes/category_router.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.routes.schema.category import CategorySchema, CategoryOutSchema
from src.database.category_db import CategoryDB
from src.database.relational_db import Database
from src.dependencies.database import get_db_session




class CategoryRouter:
    def __init__(self):
        self.router = APIRouter()
        self._add_routes()

    def _add_routes(self):
        @self.router.get("/api/category-all", response_model=list[CategoryOutSchema])
        def get_all_categories(db: Session = Depends(get_db_session)):
            category_db = CategoryDB(db)
            data = category_db.get_all_categories()
            return data

        @self.router.get("/api/category-nest", response_model=list[CategoryOutSchema])
        def get_nested_categories(db: Session = Depends(get_db_session)):
            category_db = CategoryDB(db)
            data = category_db.get_all_categories_nest()
            return data

        @self.router.post("/api/category", response_model=CategoryOutSchema)
        def create_new_category(category: CategorySchema,db: Session = Depends(get_db_session)):
            category_db = CategoryDB(db)
            return category_db.create_category(category)
