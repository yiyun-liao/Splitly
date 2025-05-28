#server/src/routes/category_router.py
from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from src.routes.schema.project import CreateProjectSchema, ProjectCreateMinimalResponse
from src.database.project_db import ProjectDB
from src.database.relational_db import Database



class ProjectRouter:
    def __init__(self, db: Database):
        self.router = APIRouter()
        self.db = db
        self._add_routes()

    def _add_routes(self):
        @self.router.post("/api/project",response_model=ProjectCreateMinimalResponse)
        def create_project(body: CreateProjectSchema):
            try:
                db_session: Session = self.db.get_session()
                project_db = ProjectDB(db_session)
                project = project_db.create_project(body)
                return {
                    "success": True,
                    "project_name": project.project_name
                }
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.router.delete("/api/project", response_model=dict)
        def delete_project(id: str):
            try:
                db_session: Session = self.db.get_session()
                project_db = ProjectDB(db_session)
                project_db.delete_project(id)

                return {"success": True, "message": f"Project {id} deleted"}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

