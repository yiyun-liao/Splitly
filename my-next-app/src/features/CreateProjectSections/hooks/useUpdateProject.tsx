import { updateProject } from "@/lib/projectApi";
import { GetProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

type UseUpdateProjectOptions = {
    onSuccess?: (project: GetProjectData) => void;
    onError?: (error: unknown) => void;
};

export function useUpdateProject(options?: UseUpdateProjectOptions) {
    const { setProjectData, projectData, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false); 

    const handleUpdateProject = async (projectPayload: GetProjectData) => {
        console.log("create", projectPayload);
        try {
            setIsLoading(true);
            const result = await updateProject(projectPayload.id ,projectPayload);
            const project = result?.project;

            if (project && project.img !== undefined) {
                const rawProject: GetProjectData = {
                    ...project,
                    imgURL: buildProjectCoverUrl(project.img),
                };
                if (!setProjectData) return;
                if (setProjectData){
                    setProjectData((prev)=>{
                        const newProjectList = (prev?? []).map((p)=>
                            p.id === rawProject.id ? rawProject : p
                        )
                        if (userData) {
                            const uid = userData.uid;
                            const projectKey = `👀 myProjectList:${uid}`;
                            const myMetaKey = `👀 cacheMyMeta:${uid}`;
                    
                            localStorage.setItem(projectKey, JSON.stringify(newProjectList));
                            localStorage.setItem(myMetaKey, JSON.stringify({ timestamp: Date.now() }));
                        }
                        return newProjectList;
                    })
                    options?.onSuccess?.(project); // ✅ 執行 callback
                }

            } else {
                console.error("⚠️ createProject 回傳格式不符合預期", result);
            }
        } catch (error) {
            console.error("Create project failed:", error);
            options?.onError?.(error); // ✅ 錯誤處理 callback
        } finally {
            setIsLoading(false); 
        }
    };
    return { handleUpdateProject, isLoading };
};
