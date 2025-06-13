'use client';

import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { updateProject } from "@/lib/projectApi";
import { fetchUserByProject } from "@/lib/userApi";

import { GetProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";
import { buildAvatarUrl } from "@/utils/getAvatar"; 


type UseUpdateProjectOptions = {
    onSuccess?: (project: GetProjectData) => void;
    onError?: (error: unknown) => void;
};

export function useUpdateProject(options?: UseUpdateProjectOptions) {
    const { setProjectData, userData } = useAuth();
    const { setCurrentProjectUsers } = useCurrentProjectData();
    const { setLoading } = useLoading();

    const handleUpdateProject = async (projectPayload: GetProjectData) => {
        const toastId = toast.loading("更新中…");
        try {
            setLoading(true);
            const result = await updateProject(projectPayload.id ,projectPayload);
            const rawProject = result?.project;

            if(!rawProject){
                throw new Error("⚠️ createProject 回傳格式不符合預期", result);
            }

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
                //  重新取得 project user 並更新 currentProjectUsers 與 cache
                const rawUsers = await fetchUserByProject(rawProject.id);
                const projectUsers: UserData[] = rawUsers.map((user: UserData) => ({
                    ...user,
                    avatarURL: buildAvatarUrl(Number(user.avatar)),
                }));

                if (setCurrentProjectUsers){
                    setCurrentProjectUsers(projectUsers);
    
                    // 更新 localStorage cache
                    if (typeof window !== "undefined") {
                        const userKey = `projectUsers | ${rawProject.id}`;
                        const metaKey = `cacheProjectMeta | ${rawProject.id}`;
                        localStorage.setItem(userKey, JSON.stringify(projectUsers));
                        localStorage.setItem(metaKey, JSON.stringify({ timestamp: Date.now() }));
                    }
                }
                toast.success("更新成功！", { id: toastId });
                options?.onSuccess?.(newProject); // 執行 callback
            }
        } catch (error) {
            toast.error("更新失敗，請稍後再試", { id: toastId });
            console.error("Create project failed:", error);
            options?.onError?.(error); // ✅ 錯誤處理 callback
        } finally {
            setLoading(false);
        }
    };
    return { handleUpdateProject };
};
