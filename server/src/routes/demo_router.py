# server/src/routes/demo_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import delete
from sqlalchemy.orm import Session
from src.dependencies.firebase import verify_firebase_token
from src.dependencies.database import get_db_session
from src.database.demo_db import DemoDB




DEMO_UID = "wfs5LgjSHBVPvGRpGG1ak3py5R83"
DEMO_PROJECT_ID = "b9f94b9a-3a6f-4de0-bba0-96ca6d8ad9da"


class DemoRouter:
    def __init__(self):
        self.router = APIRouter()
        self._add_routes()

    def _add_routes(self):
        @self.router.patch("/api/auth/demo_user", tags=["demo"])
        def reset_demo_user(
            uid_verified: str = Depends(verify_firebase_token),
            db: Session = Depends(get_db_session),
        ):
            # 只允许 Demo UID 调用
            if uid_verified != DEMO_UID:
                raise HTTPException(403, "Only demo user may call this endpoint")

            try:
                demo_db = DemoDB(db)
                result = demo_db.refresh_demo_all(DEMO_UID, DEMO_PROJECT_ID)
                return {"success": True}

            except Exception as e:
                db.rollback()
                raise HTTPException(500, f"Demo reset failed: {e}")

