import { createContext, useContext } from "react";
import { UserData } from "@/types/user";
import { GetProjectData } from "@/types/project";

type ProjectContextType = {
    projectData?: GetProjectData[];
    currentProjectData?: GetProjectData;
    userData: UserData;
  };

export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectData = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjectData 必須在 ProjectProvider 內使用");
    }
    return context;
};
    