import { createContext, useContext } from "react";
import { UserData } from "@/types/user";
import { GetProjectData } from "@/types/project";

type GlobalProjectContextType = {
  projectData: GetProjectData[];
  userData: UserData;
};

export const GlobalProjectContext = createContext<GlobalProjectContextType | undefined>(undefined);

export const useGlobalProjectData = () => {
  const context = useContext(GlobalProjectContext);
  if (!context) {
    throw new Error("useGlobalProjectData 必須在 GlobalProjectProvider 內使用");
  }
  return context;
};
