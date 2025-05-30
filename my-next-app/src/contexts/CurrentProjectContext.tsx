import { createContext, useContext } from "react";
import { UserData } from "@/types/user";
import { GetProjectData } from "@/types/project";

type CurrentProjectContextType = {
  currentProjectData: GetProjectData;
  currentProjectUserData?: UserData;
};

export const CurrentProjectContext = createContext<CurrentProjectContextType | undefined>(undefined);

export const useCurrentProjectData = () => {
  const context = useContext(CurrentProjectContext);
  if (!context) {
    throw new Error("useCurrentProjectData 必須在 CurrentProjectProvider 內使用");
  }
  return context;
};
