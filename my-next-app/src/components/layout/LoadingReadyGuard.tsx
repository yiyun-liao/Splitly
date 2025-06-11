'use client';

import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

export function LoadingReadyGuard({ children }: { children: React.ReactNode }) {
    const { isLoadedReady:myDataReady, userData, projectData } = useAuth();
    const { isReady: projectReady, currentProjectData } = useCurrentProjectData();

    console.log(`loading... authReady: ${myDataReady},projectData: ${projectData}, userData: ${userData}, projectReady: ${projectReady}, currentProjectData: ${currentProjectData}`)
    
    const isFullyReady = myDataReady && projectReady && !!userData && !!currentProjectData;
    
    if (isFullyReady === true){
        console.log("Have a nice day 🏖️ !");
    } 

    if (!isFullyReady) return <LoadingScreen />;

    return <>{children}</>;
}
