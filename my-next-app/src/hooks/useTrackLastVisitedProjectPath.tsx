import { useEffect } from "react";
import { useParams } from "next/navigation";

export function useTrackLastVisitedProjectPath() {
    const { projectId } = useParams();
    const pureProjectId = typeof projectId === 'string' ? projectId : projectId?.[0] || '';
    const key = "lastVisitedProjectPath"
    
    useEffect(() => {
        if (!projectId) return; 
        const lastPath = localStorage.getItem(key);
        if (projectId === lastPath) return;

        console.log("換專案了", projectId)
        localStorage.setItem(key, pureProjectId);

    }, [projectId, pureProjectId]);
}


export function getLocalStorageItem<T = string>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = localStorage.getItem(key);
    return value !== null ? (value as T) : null;
  } catch (e) {
    console.warn("❗localStorage 讀取失敗", e);
    return null;
  }
}
