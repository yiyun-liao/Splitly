'use client';
import { ReactNode } from "react";
import { useMemo } from "react";
import { useParams } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext"; //用 context 拿 userData 不驗證
import { ProjectContext } from "@/contexts/ProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import MemberHeader from "@/features/MemberHeader";
import MemberNav from "@/features/MemberNav";


export default function DashboardLayout({ children }: { children: ReactNode }) {
const { userData, loading, projectData } = useAuth();
const { projectId } = useParams();
const currentProjectData = useMemo(() => {
    return projectData.find(project => project.id === projectId);
}, [projectData, projectId]);

console.log('projectId:', projectId);


if (loading) return <p>Loading...</p>; // 可加 spinner
if (!currentProjectData) return <p>尚未選擇專案</p>;
if (!userData) {
    console.error("userData is null");
    return <p>無法取得使用者資料</p>; // 或 return null
}
    
return (
    <ProjectContext.Provider value={{ projectData: projectData ?? [], userData, currentProjectData:currentProjectData }}>
        <CategoryProvider>
            <main className="flex items-start justify-center bg-sp-blue-100">
            <div className="shrink-0 box-border">
                <MemberNav/>
            </div>
            <div className="py-4 w-full max-w-520 h-screen box-border flex flex-col items-center justify-start gap-2">
                <MemberHeader/>
                <div className="flex items-start justify-start box-border px-6 gap-6 w-full h-full overflow-hidden text-zinc-700">
                {children} {/* 所有 children 都能透過 useProjectData 拿到 projectData */}
                </div>
            </div>
            </main>
        </CategoryProvider>
    </ProjectContext.Provider>
);
}
