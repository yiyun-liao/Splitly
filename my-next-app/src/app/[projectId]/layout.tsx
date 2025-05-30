'use client';
import { ReactNode } from "react";
import { useMemo } from "react";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useAuth } from "@/contexts/AuthContext"; //用 context 拿 userData 不驗證
import { GlobalProjectContext } from "@/contexts/GlobalProjectContext";
import { CurrentProjectContext} from "@/contexts/CurrentProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { useProjectUsers } from "@/hooks/useProjectUsers";

import MemberHeader from "@/features/MemberHeader";
import MemberNav from "@/features/MemberNav";


export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const { userData, projectData, isReady:myDataLoading } = useAuth();
    const { projectId } = useParams();
    console.log('projectId:', projectId);


    const currentProjectData = useMemo(() => {
        if (!projectId || !myDataLoading) return undefined;
        return projectData.find(project => project.id === projectId);
    }, [projectData, projectId, myDataLoading]);

    const { users: currentProjectUsers, payments:currentPaymentList, isReady: usersLoading } = useProjectUsers(currentProjectData?.id);

    console.log("who am i", userData)
    console.log("what project i involved", projectData)
    console.log("what i get currentProjectData",currentProjectData)
    console.log("what i get currentProjectUsers",currentProjectUsers)
    console.log("what i get currentPaymentList", currentPaymentList)


    if ( !myDataLoading || !usersLoading) return <p>Loading...</p>;

    if (!currentProjectData) {
        console.error("沒有拿到 currentProjectData", projectId);
        if (projectData.length > 0) {
            router.push(`/${projectData[0].id}/dashboard`);
        }
        return null;
    }

    if (!userData) {
        console.error("userData is null");
        return <p>無法取得使用者資料</p>; // 或 return null
    }
        
    return (
        <GlobalProjectContext.Provider value={{ projectData: projectData ?? [], userData}}>
            <CurrentProjectContext.Provider value={{ currentProjectData, currentProjectUsers, currentPaymentList }}>
                <CategoryProvider>
                    <main className="flex items-start justify-center bg-sp-blue-100">
                    <div className="shrink-0 box-border">
                        <MemberNav/>
                    </div>
                    <div className="py-4 w-full max-w-520 h-screen box-border flex flex-col items-center justify-start gap-2">
                        <MemberHeader/>
                        <div className="flex items-start justify-start box-border px-6 gap-6 w-full h-full overflow-hidden text-zinc-700">
                        {children} 
                        </div>
                    </div>
                    </main>
                </CategoryProvider>
            </CurrentProjectContext.Provider>
        </GlobalProjectContext.Provider>
    );
}
