'use client'
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { GetPaymentData } from "@/types/payment";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserByProject } from "@/lib/projectApi";
import { fetchPaymentsByProject } from "@/lib/paymentApi";
import { buildAvatarUrl } from "@/utils/avatar";

type CurrentProjectContextType = {
    currentProjectData?: GetProjectData;
    currentProjectUsers?: UserData[];
    currentPaymentList?: GetPaymentData[];
    setCurrentPaymentList?: React.Dispatch<React.SetStateAction<GetPaymentData[] | undefined>>;
    isReady: boolean;
};

export const CurrentProjectContext = createContext<CurrentProjectContextType | undefined>(undefined);

type CurrentProjectProviderProps = {
    children: React.ReactNode;
};

export const CurrentProjectProvider = ({ children }: CurrentProjectProviderProps) => {
    const { projectData, isReady: myDataLoading } = useAuth();
    const router = useRouter();
    const { projectId } = useParams();

    const currentProjectData = useMemo(() => {
        if (!projectId || !myDataLoading) return undefined;
        return projectData.find(project => project.id === projectId);
    }, [projectData, projectId, myDataLoading]);
    
    const [currentProjectUsers, setCurrentProjectUsers] = useState<UserData[] | undefined>();
    const [currentPaymentList, setCurrentPaymentList] = useState<GetPaymentData[] | undefined>();
    const [loading, setLoading] = useState(false);
    const isReady = !!currentProjectUsers && !loading && !!currentPaymentList;

    useEffect(() => {
        if (!currentProjectData?.id) return;
        console.log("✅ running currentProjectContext fetcher"); 
        
        const fetchProjectUsers = async(projectId:string) => {
            setLoading(true);
            try{
                const rawUsers = await fetchUserByProject(projectId)
                const fullUsers: UserData[] = rawUsers.map((user: UserData)=>({
                    ...user,
                    avatarURL: buildAvatarUrl(Number(user?.avatar) || 1),
                }))
    
                const rawPayments = await fetchPaymentsByProject(projectId);
                const fullPayments = rawPayments.payments;
                setCurrentProjectUsers(fullUsers);
                setCurrentPaymentList(fullPayments)
            }catch(error){
                console.error("Error fetching project user data:", error);
                setCurrentProjectUsers(undefined);
                setCurrentPaymentList(undefined);
            }finally{
                setLoading(false);
            }
        }
        
        fetchProjectUsers(currentProjectData?.id);
    }, [currentProjectData]);


    // 若找不到專案，自動跳轉到第一個
    useEffect(() => {
        if (myDataLoading && !currentProjectData && projectData.length > 0) {
        router.push(`/${projectData[0].id}/dashboard`);
        }
    }, [myDataLoading, currentProjectData, projectData, router]);

    return (
        <CurrentProjectContext.Provider
        value={{
            currentProjectData,
            currentProjectUsers,
            currentPaymentList,
            setCurrentPaymentList,
            isReady,
        }}
        >
        {children}
        </CurrentProjectContext.Provider>
    );
};

export const useCurrentProjectData = () => {
  const context = useContext(CurrentProjectContext);
  if (!context) {
    throw new Error("useCurrentProjectData 必須在 CurrentProjectProvider 內使用");
  }
  return context;
};
