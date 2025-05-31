import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv


from src.database.relational_db import Database
from src.routes.auth_router import AuthRouter
from src.routes.user_router import UserRouter
from src.routes.category_router import CategoryRouter
from src.routes.project_router import ProjectRouter
from src.routes.payment_router import PaymentRouter


load_dotenv()
app = FastAPI()  # Create FastAPI app instance

ENV = os.getenv("ENV", "dev")  # 預設為 dev，除非環境變數指定為 production

if ENV == "dev":
    origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
else:
    origins = [
    "https://splitlyme.online",
    "https://splitly-steel.vercel.app"
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

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found in .env")

db = Database(db_url=DATABASE_URL, echo=True) 

auth_router_instance = AuthRouter(db=db)
user_router_instance = UserRouter(db=db)
category_router_instance = CategoryRouter(db=db)
project_router_instance = ProjectRouter(db=db)
payment_router_instance = PaymentRouter(db=db)


app.include_router(auth_router_instance.router)
app.include_router(user_router_instance.router)
app.include_router(category_router_instance.router)
app.include_router(project_router_instance.router)
app.include_router(payment_router_instance.router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

@app.get("/")
def root():
    return {"message": "Hello from Splitly backend"}