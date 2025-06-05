import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";


export function useTrackLastVisitedProjectPath() {
    const pathname = usePathname();
    const { projectId } = useParams();
    const pureProjectId = typeof projectId === 'string' ? projectId : projectId?.[0] || '';
    const key = "lastVisitedProjectPath"
    const lastPath = localStorage.getItem("lastVisitedProjectPat");

    useEffect(() => {
        if (!projectId) return;
        const isValidProjectPath = /^\/[^\/]+\/(dashboard|expense|overview)$/.test(pathname);
        if ( projectId && isValidProjectPath && projectId !== lastPath ){
            console.log("換專案了", projectId)
            localStorage.setItem(key, pureProjectId);
        }
    }, [projectId, pathname, lastPath, pureProjectId]);
}