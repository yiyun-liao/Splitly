'use client';

import { createProject } from "@/lib/projectApi";
import { ProjectData,GetProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";

type UseCreateProjectOptions = {
    onSuccess?: (project: GetProjectData) => void;
    onError?: (error: unknown) => void;
};

export function useCreateProject(options?: UseCreateProjectOptions) {
    const { addProject, projectData, userData } = useAuth();
    const { setLoading } = useLoading();

    const handleCreateProject = async (projectPayload: ProjectData) => {
        const toastId = toast.loading("新增中…");
        try {
            setLoading(true);
            const result = await createProject(projectPayload);
            const project = result?.project;

            if (!project){
                throw new Error("⚠️ createProject 回傳格式不符合預期", result);
            }

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
                toast.success("新增成功！", { id: toastId });
                options?.onSuccess?.(fullProject); // ✅ 執行 callback
            }
        } catch (error) {
            toast.error("新增失敗，請稍後再試", { id: toastId });
            console.error("Create project failed:", error);
            options?.onError?.(error); // ✅ 錯誤處理 callback
        } finally {
            setLoading(false);
        }
    };
    return { handleCreateProject };
};
