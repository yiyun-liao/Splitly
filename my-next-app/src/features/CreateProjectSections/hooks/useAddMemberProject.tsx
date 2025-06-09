import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { updateProject } from "@/lib/projectApi";
import { GetProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";

type UseUpdateProjectOptions = {
    onSuccess?: (project: GetProjectData) => void;
    onError?: (error: unknown) => void;
};

export function useAddMemberProject(options?: UseUpdateProjectOptions) {
    const { setProjectData, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false); 

    const handleUpdateProject = async (projectPayload: GetProjectData) => {
        console.log("create", projectPayload);
        try {
            setIsLoading(true);
            const result = await updateProject(projectPayload.id ,projectPayload);
            const rawProject = result?.project;

            if (rawProject && rawProject.img !== undefined) {
                const newProject: GetProjectData = {
                    ...rawProject,
                    imgURL: buildProjectCoverUrl(rawProject.img),
                };
                if (!setProjectData) return;
                if (setProjectData){
                    setProjectData((prev)=>{
                        const newProjectList = (prev?? []).map((p)=>
                            p.id === newProject.id ? newProject : p
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
                }
                options?.onSuccess?.(newProject); // 執行 callback
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
