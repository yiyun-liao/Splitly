'use client';
import { useAuth } from "@/contexts/AuthContext";
import ProjectForm from "@/features/CreateProjectSections/ProjectForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getLastVisitedProjectId } from "@/utils/cache";


export default function CreateFirstProject() {
    const { userData, projectData, isReady } = useAuth();
    const router = useRouter();
    const lastPath = getLastVisitedProjectId() || projectData?.[0]?.id;;;


    useEffect(() => {
        if (!isReady) return;

        if (projectData && projectData.length > 0) {
            console.log("你已經有專案了")
            router.push(`/${userData?.uid}/${lastPath}/dashboard`);
        }
    }, [isReady, router, projectData, lastPath, userData]);

    if (!userData) return null;

    return (
        <ProjectForm 
            userData={userData} 
            onClose={() => {}} 
            sheetTitle="建立第一個專案！" 
        />);
}