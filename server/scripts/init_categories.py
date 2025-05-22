# server/scripts/init_categories.py

from src.database.relational_db import Database
from src.database.models.category import CategoryModel

db = Database(db_url="sqlite:///./db.sqlite3")

nested_categories = {
    "飲食": ["早餐", "午餐", "晚餐", "點心", "雜貨食品", "飲料", "酒類", "其他"],
    "購物": ["衣物", "鞋子", "配件", "包包", "美妝保養", "精品", "禮物", "電子產品", "其他"],
    "交通及住宿": ["住宿", "加油", "停車", "租車", "火車", "計程車", "機票", "船票", "保險", "其他"],
    "家居": ["家具", "日常用品", "電費", "水費", "瓦斯費", "房租", "洗衣費", "修繕費", "訂閱", "網路費", "電話費", "清潔費用", "其他"],
    "娛樂": ["遊戲", "美容", "遊樂園", "展覽", "電影", "音樂", "運動", "派對", "按摩", "其他"]
}

def seed_categories():
    for parent_name, children in nested_categories.items():
        # 建立父分類
        parent = CategoryModel(name=parent_name)
        db.add(parent)
        db.session.flush()  # 取得 parent.id

        for child_name in children:
            child = CategoryModel(name=child_name, parent_id=parent.id)
            db.add(child)

    db.session.commit()
    print("✅ 成功建立分類！")

if __name__ == "__main__":
    seed_categories()
