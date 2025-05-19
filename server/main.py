import uvicorn
from fastapi import FastAPI

from src.database.relational_db import Database
from src.routes.router import Router


app = FastAPI()  # Create FastAPI app instance

db = Database(db_url="sqlite:///test.db")
router = Router(db=db)
app.include_router(router.router)  # Include router in the FastAPI app

def main():
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()