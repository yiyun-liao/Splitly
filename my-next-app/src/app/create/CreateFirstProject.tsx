'use client';
import { useAuth } from "@/contexts/AuthContext";
import ProjectForm from "@/features/CreateProjectSections/ProjectForm";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

export default function CreateFirstProject() {
    const { projectId } = useParams();
    const { firebaseUser, userData, isReady } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isReady) return;

        if (!firebaseUser || !userData) {
            const redirect = `/join?pid=${projectId}`;
            router.push(`/?redirect=${encodeURIComponent(redirect)}`);
        }
    }, [isReady, firebaseUser, userData, projectId, router]);

    if (!userData) return null;

    return (
        <ProjectForm 
            userData={userData} 
            onClose={() => {}} 
            sheetTitle="建立第一個專案！" 
        />);
}