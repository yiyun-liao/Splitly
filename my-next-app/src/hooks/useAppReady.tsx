// hooks/useAppReady.ts
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

export function useAppReady() {
    const { isReady: authReady, userData, projectData } = useAuth();
    const { isReady: projectReady, currentProjectData } = useCurrentProjectData();
    console.log(`loading... authReady: ${authReady},projectData: ${projectData}, userData: ${userData}, projectReady: ${projectReady}, currentProjectData: ${currentProjectData}`)

    const isFullyReady = authReady && projectReady && !!userData && !!currentProjectData;

    return isFullyReady;
}
