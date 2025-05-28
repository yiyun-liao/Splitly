#server/src/routes/category_router.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database.models.project import ProjectEditorRelation, ProjectMemberRelation
from src.routes.schema.project import CreateProjectSchema, ProjectCreateMinimalResponse
from src.database.project_db import ProjectDB
from src.database.relational_db import Database
from src.dependencies.firebase import verify_firebase_token




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


        @self.router.get("/api/project/by-user", response_model=list[CreateProjectSchema])
        def get_user_projects(uid: str, uid_verified: str = Depends(verify_firebase_token)):
            if uid != uid_verified:
                raise HTTPException(status_code=403, detail="Unauthorized")

            try:
                db_session: Session = self.db.get_session()
                project_db = ProjectDB(db_session)
                projects = project_db.get_projects_by_user_id(uid)
                result = []

                for project in projects:
                    # 查出 editors
                    editor_uids = [
                        rel.user_id for rel in self.db.session.query(ProjectEditorRelation)
                        .filter_by(project_id=project.id)
                        .all()
                    ]

                    # 查出 members
                    member_uids = [
                        rel.user_id for rel in self.db.session.query(ProjectMemberRelation)
                        .filter_by(project_id=project.id)
                        .all()
                    ]

                    result.append(CreateProjectSchema(
                        id=project.id,
                        project_name=project.project_name,
                        start_time=project.start_time,
                        end_time=project.end_time,
                        style=project.style,
                        currency=project.currency,
                        budget=project.budget,
                        owner=project.owner,
                        member_budgets=project.member_budgets or {},
                        img=project.img,
                        desc=project.desc,
                        editor=editor_uids,
                        member=member_uids
                    ))

                return result
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")