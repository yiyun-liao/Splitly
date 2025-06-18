'use client';
import { createContext, useContext} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GetProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { useEffect } from "react";

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
    useEffect(() => {
        // 預載 avatars
        Array.from({ length: 15 }, (_, index) => {
            const img = new Image();
            img.src = `https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750175833/avatar/${index + 1}.jpg`;
        });

        // 預載其他素材圖
        Array.from({ length: 16 }, (_, index) => {
            const img = new Image();
            img.src = `https://res.cloudinary.com/ddkkhfzuk/image/upload/v1750164850/${index + 1}.jpg`;
        });
    }, []);

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
