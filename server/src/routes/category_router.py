#server/src/routes/category_router.py
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.category import CategorySchema, CategoryOutSchema
from src.database.category_db import CategoryDB
from src.database.relational_db import Database



class CategoryRouter:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db
        self._add_routes()

    def _add_routes(self):
        @self.router.get("/api/category-all", response_model=list[CategoryOutSchema])
        def get_categories():
            db_session: Session = self.db.get_session()
            category_db = CategoryDB(db_session)
            data = category_db.get_all_categories()
            # pydantic_data = [CategoryOutSchema.model_validate(item) for item in data]
            # print([item.model_dump() for item in pydantic_data])
            return data

        @self.router.get("/api/category-nest", response_model=list[CategoryOutSchema])
        def get_categories():
            db_session: Session = self.db.get_session()
            category_db = CategoryDB(db_session)
            data = category_db.get_all_categories_nest()
            return data

        @self.router.post("/api/category", response_model=CategoryOutSchema)
        def create_new_category(category: CategorySchema):
            db_session: Session = self.db.get_session()
            category_db = CategoryDB(db_session)
            return category_db.create_category(db_session, category)
