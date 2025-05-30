# terminal: PYTHONPATH=. python3 scripts/init_categories.py
from src.database.relational_db import Database
from src.database.models.category import CategoryModel
from src.database.models.base import Base

db = Database(db_url="sqlite:///./db.sqlite3")  # ✅ 請改成你的正式 DB

# 類別中英對照
nested_categories = {
    "Food & Drink": {
        "zh": "飲食",
        "children": {
            "Breakfast": "早餐",
            "Lunch": "午餐",
            "Dinner": "晚餐",
            "Snacks": "點心",
            "Groceries": "雜貨食品",
            "Drinks": "飲料",
            "Alcohol": "酒類",
            "Others": "其他"
        }
    },
    "Shopping": {
        "zh": "購物",
        "children": {
            "Clothing": "衣物",
            "Shoes": "鞋子",
            "Accessories": "配件",
            "Bags": "包包",
            "Beauty": "美妝保養",
            "Luxury": "精品",
            "Gifts": "禮物",
            "Electronics": "電子產品",
            "Others": "其他"
        }
    },
    "Transport & Stay": {
        "zh": "交通及住宿",
        "children": {
            "Hotel": "住宿",
            "Gas": "加油",
            "Parking": "停車",
            "Rental": "租車",
            "Train": "火車",
            "Taxi": "計程車",
            "Flight": "機票",
            "Boat": "船票",
            "Insurance": "保險",
            "Others": "其他"
        }
    },
    "Home": {
        "zh": "家居",
        "children": {
            "Furniture": "家具",
            "Supplies": "日常用品",
            "Electricity": "電費",
            "Water": "水費",
            "Gas": "瓦斯費",
            "Rent": "房租",
            "Laundry": "洗衣費",
            "Repair": "修繕費",
            "Subscription": "訂閱",
            "Internet": "網路費",
            "Phone": "電話費",
            "Cleaning": "清潔費用",
            "Others": "其他"
        }
    },
    "Entertainment": {
        "zh": "娛樂",
        "children": {
            "Games": "遊戲",
            "Salon": "美容",
            "Theme Park": "遊樂園",
            "Exhibition": "展覽",
            "Movie": "電影",
            "Music": "音樂",
            "Sports": "運動",
            "Party": "派對",
            "Massage": "按摩",
            "Others": "其他"
        }
    }
}

def reset_categories():
    CategoryModel.__table__.drop(bind=db.engine, checkfirst=True)
    CategoryModel.__table__.create(bind=db.engine, checkfirst=True)
    print("✅ categories table 已重新建立")

def seed_categories():
    for parent_en, meta in nested_categories.items():
        parent_zh = meta["zh"]
        children = meta["children"]

        parent = CategoryModel(name_en=parent_en, name_zh=parent_zh)
        db.add(parent)
        db.session.flush()

        for child_en, child_zh in children.items():
            child = CategoryModel(name_en=child_en, name_zh=child_zh, parent_id=parent.id)
            db.add(child)

    db.session.commit()
    print("✅ 成功建立中英文分類！")

if __name__ == "__main__":
    reset_categories()
    seed_categories()
