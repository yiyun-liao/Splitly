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
from src.routes.demo_router import DemoRouter


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
    api = request.url
    origin = request.headers.get("origin", "No Origin")
    method = request.method
    path = request.url.path
    print(f"🔥 收到請求： | Method: {method} | Path: {path} | Api: {api} | Origin: {origin}")

    response = await call_next(request)
    return response

print("🌎 啟動 FastAPI，ENV=", ENV)
print("✅ 啟用 CORS origins：", origins)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found in .env")
if DATABASE_URL.startswith("postgres://"):
    os.environ["DATABASE_URL"] = DATABASE_URL.replace("postgres://", "postgresql://", 1)

auth_router_instance = AuthRouter()
user_router_instance = UserRouter()
category_router_instance = CategoryRouter()
project_router_instance = ProjectRouter()
payment_router_instance = PaymentRouter()
demo_router_instance = DemoRouter()



app.include_router(auth_router_instance.router)
app.include_router(user_router_instance.router)
app.include_router(category_router_instance.router)
app.include_router(project_router_instance.router)
app.include_router(payment_router_instance.router)
app.include_router(demo_router_instance.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

@app.get("/")
def root():
    return {"message": "Hello from Splitly backend"}