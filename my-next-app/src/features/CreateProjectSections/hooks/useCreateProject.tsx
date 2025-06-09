import { createProject } from "@/lib/projectApi";
import { ProjectData,GetProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

type UseCreateProjectOptions = {
    onSuccess?: (project: GetProjectData) => void;
    onError?: (error: unknown) => void;
};

export function useCreateProject(options?: UseCreateProjectOptions) {
    const { addProject, projectData, userData } = useAuth();
    const [isLoading, setIsLoading] = useState(false); 

    const handleCreateProject = async (projectPayload: ProjectData) => {
        console.log("create", projectPayload);
        try {
            setIsLoading(true);
            const result = await createProject(projectPayload);
            const project = result?.project;

            if (project && project.img !== undefined) {
                const fullProject: GetProjectData = {
                    ...project,
                    imgURL: buildProjectCoverUrl(project.img),
                };
                addProject(fullProject);

                if (userData) {
                    const uid = userData.uid;
                    const projectKey = `👀 myProjectList:${uid}`;
                    const myMetaKey = `👀 cacheMyMeta:${uid}`;
                    const updatedProjectList = [...projectData, fullProject];
            
                    localStorage.setItem(projectKey, JSON.stringify(updatedProjectList));
                    localStorage.setItem(myMetaKey, JSON.stringify({ timestamp: Date.now() }));
                }
                options?.onSuccess?.(fullProject); // ✅ 執行 callback
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
    return { handleCreateProject, isLoading };
};
