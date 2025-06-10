// hooks/useAppReady.ts
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

export function useAppReady() {
    const { isLoadedReady:myDataReady, userData, projectData } = useAuth();
    const { isReady: projectReady, currentProjectData } = useCurrentProjectData();
    console.log(`loading... authReady: ${myDataReady},projectData: ${projectData}, userData: ${userData}, projectReady: ${projectReady}, currentProjectData: ${currentProjectData}`)
    const isFullyReady = myDataReady && projectReady && !!userData && !!currentProjectData;
    if (isFullyReady === true){
        console.log("Have a great day! 🏖️");
    } 
        
    return isFullyReady;
}
