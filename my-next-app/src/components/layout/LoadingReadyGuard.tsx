'use client';

import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { usePathname } from "next/navigation";



export function LoadingReadyGuard({ children }: { children: React.ReactNode }) {
    const { isLoadedReady:myDataReady, userData, projectData } = useAuth();
    const { isReady: projectReady, currentProjectData } = useCurrentProjectData();
    const pathname = usePathname();
    const isCreatePage = pathname?.endsWith("/create");
    console.log(`loading... authReady: ${myDataReady},projectData: ${projectData}, userData: ${userData}, projectReady: ${projectReady}, currentProjectData: ${currentProjectData}`)

    const isFullyReady = isCreatePage
    ? myDataReady && !!userData && !!projectData
    : myDataReady && projectReady && !!userData && !!currentProjectData && projectData.length > 0;

    
    if (isFullyReady === true){
        console.log("Have a nice day 🏖️ !");
    } 

    if (!isFullyReady) return <LoadingScreen />;

    return <>{children}</>;
}
