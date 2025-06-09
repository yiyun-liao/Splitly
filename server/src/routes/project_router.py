#server/src/routes/project_router.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.routes.schema.project import CreateProjectSchema, ProjectCreateMinimalResponse,AddProjectMembersSchema, GetProjectSchema, UpdateProjectSchema,JoinProjectSchema
from src.database.project_db import ProjectDB
from src.database.relational_db import Database
from src.dependencies.firebase import verify_firebase_token
from src.dependencies.database import get_db_session


class ProjectRouter:
    def __init__(self):
        self.router = APIRouter()
        self._add_routes()

    def _add_routes(self):
        # 建立專案
        @self.router.post("/api/project",response_model=ProjectCreateMinimalResponse)
        def create_project(
            body: CreateProjectSchema, 
            db: Session = Depends(get_db_session)
        ):
            try:
                project_db = ProjectDB(db)
                project = project_db.create_project_db(body)
                return {
                    "success": True,
                    "project": project
                }
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        # 取得某使用者的專案列表
        @self.router.get("/api/project/by-user", response_model=list[GetProjectSchema])
        def get_user_projects(
            uid: str, 
            uid_verified: str = Depends(verify_firebase_token), 
            db: Session = Depends(get_db_session)
        ):
            if uid != uid_verified:
                print("🚫 身份不符")
                raise HTTPException(status_code=403, detail="Unauthorized access")
            try:
                project_db = ProjectDB(db)
                projects = project_db.get_projects_by_user_id_db(uid)
                return projects
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")
            
        # 新增成員到專案
        @self.router.post("/api/project/member",response_model=ProjectCreateMinimalResponse)
        def add_project_members(projectId: str, payload: AddProjectMembersSchema, db: Session = Depends(get_db_session)):
            try:
                project_db = ProjectDB(db)
                added_uids = project_db.add_members_to_project(projectId, payload.member)

                return {
                    "success": True,
                    "member": added_uids
                }

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Add member failed: {str(e)}")
            
        # join 專案時拿到特定專案資料 
        @self.router.get("/api/project",response_model=ProjectCreateMinimalResponse)
        def get_certain_project(
            pid: str, 
            uid: str, 
            uid_verified: str = Depends(verify_firebase_token),
            db: Session = Depends(get_db_session)
        ):
            print("start")
            if uid != uid_verified:
                print("🚫 身份不符")
                raise HTTPException(status_code=403, detail="Unauthorized access")
            try:
                project_db = ProjectDB(db)
                project = project_db.get_certain_project_db(pid)
                return {
                    "success": True,
                    "project": project
                }

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Add member failed: {str(e)}")
            
        # 更新專案
        @self.router.patch("/api/project",response_model=ProjectCreateMinimalResponse)
        def update_project(
            pid: str, 
            payload: UpdateProjectSchema, 
            db: Session = Depends(get_db_session)
        ):
            try:
                project_db = ProjectDB(db)
                project = project_db.update_project_db(pid, payload)

                return {
                    "success": True,
                    "project": project
                }

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Add member failed: {str(e)}")
    

        # 新增成員到專案
        @self.router.post("/api/project/join",response_model=ProjectCreateMinimalResponse)
        def join_project(
            payload: JoinProjectSchema, 
            db: Session = Depends(get_db_session)
        ):
            try:
                project_db = ProjectDB(db)
                project = project_db.join_project_db(payload.id, payload)

                return {
                    "success": True,
                    "project": project
                }

            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Add member failed: {str(e)}")



        # # 刪除專案
        # @self.router.delete("/api/project",response_model=ProjectCreateMinimalResponse)
        # def delete_project(pid: str, db: Session = Depends(get_db_session)):
        #     try:
        #         project_db = ProjectDB(db)
        #         project_db.delete_project(pid)

        #         return {"success": True, "message": f"Project {pid} deleted"}
        #     except Exception as e:
        #         raise HTTPException(status_code=500, detail=str(e))