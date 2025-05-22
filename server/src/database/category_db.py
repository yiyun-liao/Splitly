from sqlalchemy.orm import Session
from src.database.models.category import CategoryModel 
from src.routes.schema.category import CategorySchema

def get_all_categories(db: Session):
    return db.query(CategoryModel).all()

def create_category(db: Session, category: CategorySchema):
    db_category = CategoryModel(name=category.name, parent_id=category.parent_id)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category
