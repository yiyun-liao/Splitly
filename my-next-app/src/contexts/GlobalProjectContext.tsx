'use client';
import { createContext, useContext} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GetProjectData } from "@/types/project";
import { UserData } from "@/types/user";

type GlobalProjectContextType = {
    projectData: GetProjectData[];
    userData: UserData | null;
    isReady: boolean;
};

export const GlobalProjectContext = createContext<GlobalProjectContextType | undefined>(undefined);

type GlobalProjectProviderProps = {
    children: React.ReactNode;
};

export const GlobalProjectProvider = ({ children }: GlobalProjectProviderProps) => {
    const { projectData, userData, isReady } = useAuth(); // 從 useAuth 取資料

    return (
        <GlobalProjectContext.Provider value={{ projectData, userData, isReady }}>
            {children}
        </GlobalProjectContext.Provider>
    );
};

export const useGlobalProjectData = () => {
    const context = useContext(GlobalProjectContext);
    if (!context) {
        throw new Error("useGlobalProjectData 必須在 GlobalProjectProvider 內使用");
    }
    return context;
};
