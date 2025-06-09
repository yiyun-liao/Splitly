import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { joinProject } from "@/lib/projectApi";
import { GetProjectData, JoinProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";

type UseUpdateProjectOptions = {
    onSuccess?: (project: GetProjectData) => void;
    onError?: (error: unknown) => void;
};

export function useAddMemberProject(options?: UseUpdateProjectOptions) {
    const { setProjectData, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false); 

    const handleUpdateProject = async (projectPayload: JoinProjectData) => {
        console.log("update", projectPayload);
        try {
            setIsLoading(true);
            const result = await joinProject(projectPayload);
            const rawProject = result?.project;

            if (rawProject && rawProject.img !== undefined) {
                const newProject: GetProjectData = {
                    ...rawProject,
                    imgURL: buildProjectCoverUrl(rawProject.img),
                };
                if (!setProjectData) return;
                if (setProjectData) {
                    setProjectData((prev) => {
                        const prevList = prev ?? [];
                    
                        const existingIndex = prevList.findIndex((p) => p.id === newProject.id);
                        let newProjectList;
                    
                        if (existingIndex >= 0) {
                            // 替換現有專案
                            newProjectList = [...prevList];
                            newProjectList[existingIndex] = newProject;
                        } else {
                            // 加入新專案
                            newProjectList = [...prevList, newProject];
                        }
                    
                        if (userData) {
                            const uid = userData.uid;
                            const projectKey = `👀 myProjectList:${uid}`;
                            const myMetaKey = `👀 cacheMyMeta:${uid}`;
                    
                            localStorage.setItem(projectKey, JSON.stringify(newProjectList));
                            localStorage.setItem(myMetaKey, JSON.stringify({ timestamp: Date.now() }));
                        }
                    
                        return newProjectList;
                    });
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
