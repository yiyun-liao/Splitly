#server/src/database/category_db.py
from sqlalchemy.orm import Session
from src.database.models.category import CategoryModel 
from src.routes.schema.category import CategorySchema
from fastapi import HTTPException

class CategoryDB:
    def __init__(self, db: Session):
        self.db = db

    def get_all_categories(self):
        return self.db.query(CategoryModel).all()

    def create_category(self, category: CategorySchema):
        db_category = CategoryModel(name=category.name, parent_id=category.parent_id)
        self.db.add(db_category)
        try:
            self.db.commit()
            self.db.refresh(db_category)
            return db_category
        except Exception as e:
            self.db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Category with the same name already exists under this parent.",
            )

    def get_all_categories_nest(self):
        all_categories = self.db.query(CategoryModel).filter(CategoryModel.parent_id.is_(None)).all()
        return all_categories
