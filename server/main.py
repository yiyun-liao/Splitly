import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware


from src.database.relational_db import Database
from src.routes.router import Router


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
router = Router(db=db)
app.include_router(router.router)  # Include router in the FastAPI app

def main():
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()