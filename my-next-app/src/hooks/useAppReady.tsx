// hooks/useAppReady.ts
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

export function useAppReady() {
    const { isReady: authReady, userData } = useAuth();
    const { isReady: projectReady, currentProjectData } = useCurrentProjectData();

    const isFullyReady = authReady && projectReady && !!userData && !!currentProjectData;

    return isFullyReady;
}
