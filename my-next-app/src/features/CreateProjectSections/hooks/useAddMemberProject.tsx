import { useAuth } from "@/contexts/AuthContext";
import { joinProject } from "@/lib/projectApi";
import { GetProjectData, JoinProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";
import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";

type UseUpdateProjectOptions = {
    onSuccess?: (project: GetProjectData) => void;
    onError?: (error: unknown) => void;
};

export function useAddMemberProject(options?: UseUpdateProjectOptions) {
    const { setProjectData, userData } = useAuth();
    const { setLoading } = useLoading();

    const handleUpdateProject = async (projectPayload: JoinProjectData) => {
        const toastId = toast.loading("加入中…");
        try {
            setLoading(true);
            const result = await joinProject(projectPayload);
            const rawProject = result?.project;

            if (rawProject && rawProject.img !== undefined) {
                const newProject: GetProjectData = {
                    ...rawProject,
                    imgURL: buildProjectCoverUrl(rawProject.img),
                };
                if (!setProjectData){
                    throw new Error("伺服器回傳格式不正確");
                }
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
                toast.success("加入成功！", { id: toastId });                  
                options?.onSuccess?.(newProject); // 執行 callback
            }
        } catch (error) {
            toast.error("加入失敗，請稍後再試", { id: toastId });
            console.error("Create project failed:", error);
            options?.onError?.(error); // ✅ 錯誤處理 callback
        } finally {
            setLoading(false);
        }
    };
    return { handleUpdateProject};
};
