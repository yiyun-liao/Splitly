"use client"; 
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { showInfoToast } from "@/utils/infoToast";


export function useTrackLastVisitedProjectPath() {
    const { projectId } = useParams();
    const pureProjectId = typeof projectId === 'string' ? projectId : projectId?.[0] || '';
    const key = "lastVisitedProjectPath"
    
    useEffect(() => {
        if (!projectId) return; 
        const lastPath = localStorage.getItem(key);
        if (projectId === lastPath) return;

        showInfoToast("切換專案");
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
