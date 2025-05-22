import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware


from src.database.relational_db import Database
from src.routes.auth_router import AuthRouter
from src.routes.category_router import CategoryRouter

app = FastAPI()  # Create FastAPI app instance

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # 設定允許的來源
    allow_credentials=True,
    allow_methods=["*"],    # 或指定 ['GET', 'POST'] 等等
    allow_headers=["*"],
)

@app.middleware("http")
async def log_request(request: Request, call_next):
    print("🔥 收到請求：", request.method, request.url)
    response = await call_next(request)
    return response

db = Database(db_url="sqlite:///./db.sqlite3")

auth_router_instance = AuthRouter(db=db)
category_router_instance = CategoryRouter(db=db)

app.include_router(auth_router_instance.router)
app.include_router(category_router_instance.router)



if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)