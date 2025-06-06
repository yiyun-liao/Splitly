import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";


export function useTrackLastVisitedProjectPath() {
    const { projectId } = useParams();
    const { userData } = useAuth();
    const pureProjectId = typeof projectId === 'string' ? projectId : projectId?.[0] || '';
    const key = "lastVisitedProjectPath"
    
    useEffect(() => {
        const lastPath = localStorage.getItem(key);

        if (!projectId || projectId === lastPath) return;
        // const isValidProjectPath = /^\/[^\/]+\/(dashboard|expense|overview)$/.test(pathname);
        if ( projectId && projectId !== lastPath ){
            console.log("換專案了", projectId)
            localStorage.setItem(key, pureProjectId);
            localStorage.setItem(key, JSON.stringify({
                path: pureProjectId,
                userId: userData?.uid,
              }));
        }
    }, [projectId, pureProjectId, userData]);
}