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
        existing = self.db.query(CategoryModel).filter_by(
            name_en=category.name_en,
            parent_id=category.parent_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Category with the same English name already exists under this parent.",
            )
        db_category = CategoryModel(
            name_en=category.name_en,
            name_zh=category.name_zh,
            parent_id=category.parent_id
        )
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
        all_categories = self.db.query(CategoryModel).all()
        category_map = {cat.id: {
            "id": cat.id,
            "name_en": cat.name_en,
            "name_zh": cat.name_zh,
            "parent_id": cat.parent_id,
            "children": []
        } for cat in all_categories}

        tree = []
        for cat in category_map.values():
            if cat["parent_id"]:
                parent = category_map.get(cat["parent_id"])
                if parent:
                    parent["children"].append(cat)
            else:
                tree.append(cat)

        return tree
