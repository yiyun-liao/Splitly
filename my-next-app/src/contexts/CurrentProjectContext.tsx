'use client';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GetProjectData } from "@/types/project";
import { UserData } from "@/types/user";
import { GetPaymentData } from "@/types/payment";

import { useAuth } from "@/contexts/AuthContext";
import { fetchUserByProject } from "@/lib/userApi";
import { fetchPaymentsByProject } from "@/lib/paymentApi";
import { buildAvatarUrl } from "@/utils/getAvatar";
import { getLocalStorageItem } from '@/hooks/useTrackLastVisitedProjectPath';

type CurrentProjectContextType = {
    currentProjectData?: GetProjectData;
    currentProjectUsers?: UserData[];
    currentPaymentList?: GetPaymentData[];
    setCurrentPaymentList?: React.Dispatch<React.SetStateAction<GetPaymentData[] | undefined>>;
    setCurrentProjectUsers?: React.Dispatch<React.SetStateAction<UserData[] | undefined>>;
    isReady: boolean;
};

const CurrentProjectContext = createContext<CurrentProjectContextType | undefined>(undefined);

export const CurrentProjectProvider = ({ children }: { children: React.ReactNode }) => {
    const { projectData, userData , isLoadedReady:myDataReady } = useAuth();
    const rawParam = useParams()?.projectId;
    const fallbackId = getLocalStorageItem<string>("lastVisitedProjectPath");
    const pureProjectId = typeof rawParam === "string" ? rawParam : rawParam?.[0] || fallbackId ;
    
    const router = useRouter();
    const [lastPath, setLastPath] = useState<string | undefined>(); // fallback

    const currentProjectData = useMemo(() => {
        if (!myDataReady || !pureProjectId) return undefined;
        return projectData.find(project => project.id === pureProjectId);
    }, [projectData, pureProjectId, myDataReady]);

    const [currentProjectUsers, setCurrentProjectUsers] = useState<UserData[]>();
    const [currentPaymentList, setCurrentPaymentList] = useState<GetPaymentData[]>();
  

    const [isReady, setIsReady] = useState(false); // 控制資料就緒

    // --- 設定 ready 狀態 ---
    useEffect(() => {
        if (currentProjectUsers && currentPaymentList) {
            setIsReady(true);
        }
    }, [currentProjectUsers, currentPaymentList]);


    useEffect(() => {
        if (myDataReady && projectData && currentProjectData !== undefined){
            const stored = getLocalStorageItem<string>("lastVisitedProjectPath") || (projectData?.length ? projectData[0].id : undefined);
            if (stored) {
                setLastPath(stored);
            }
        }
    }, [projectData, currentProjectData, currentProjectUsers, currentPaymentList, myDataReady]);
    

    // --- 快取 / API 載入 ---
    useEffect(() => {
        if (!pureProjectId) return;

        const userKey = `projectUsers | ${pureProjectId}`;
        const paymentKey = `paymentList | ${pureProjectId}`;
        const metaKey = `cacheProjectMeta | ${pureProjectId}`;
        const CACHE_TTL = 1000 * 60 * 60;
        
        const isPageReload = typeof window !== 'undefined' &&
             (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';
        // const isPageReload = false;
    
        const cachedUsers = localStorage.getItem(userKey);
        const cachedPayments = localStorage.getItem(paymentKey);
        const cachedMeta = localStorage.getItem(metaKey);
        const isCacheExpired = !cachedMeta || Date.now() - JSON.parse(cachedMeta).timestamp > CACHE_TTL;


        if (cachedUsers && cachedPayments && !isCacheExpired && !isPageReload) {
            try {
                console.log("✅ get data")
                setCurrentProjectUsers(JSON.parse(cachedUsers));
                setCurrentPaymentList(JSON.parse(cachedPayments));
                setIsReady(true); // ✅ 快取成功也標記 ready
                return;
            } catch (error) {
                console.warn("❌ 快取解析失敗，清除...", error);
                localStorage.removeItem(userKey);
                localStorage.removeItem(paymentKey);
                localStorage.removeItem(metaKey);
            }
            
        }

        const fetchProjectData = async () => {
            try {
                console.log("🙃 fetch current data")
                if (!pureProjectId) {
                    console.warn("🚫 無效的 projectId，跳過 fetch");
                    return;
                }
                const rawUsers = await fetchUserByProject(pureProjectId);
                const users: UserData[] = rawUsers.map((user:UserData) => ({
                    ...user,
                    avatarURL: buildAvatarUrl(Number(user.avatar) || 1),
                }));

                const rawPayments = await fetchPaymentsByProject(pureProjectId);
                const payments = rawPayments.payments;

                setCurrentProjectUsers(users);
                setCurrentPaymentList(payments);

                localStorage.setItem(userKey, JSON.stringify(users));
                localStorage.setItem(paymentKey, JSON.stringify(payments));
                localStorage.setItem(metaKey, JSON.stringify({ timestamp: Date.now() }));

                setIsReady(true); // ✅ fetch 成功標記 ready
            } catch (err) {
                console.error("🔴 專案資料取得失敗", err);
                setCurrentProjectUsers(undefined);
                setCurrentPaymentList(undefined);
                setIsReady(true); // ✅ 即使失敗，也要讓頁面能跳錯誤頁等
            }
        };

        fetchProjectData();
    }, [pureProjectId]);


    // --- 找不到專案自動跳轉 ---
    useEffect(() => {
        if (!pureProjectId) return;
        if (!myDataReady || !projectData.length) return;
        if (!currentProjectData) {
            router.replace(`/${userData?.uid}/${lastPath}/dashboard`);
        }
    }, [myDataReady, currentProjectData, projectData, router, pureProjectId, lastPath,userData]);

    return (
        <CurrentProjectContext.Provider
        value={{
            currentProjectData,
            currentProjectUsers,
            currentPaymentList,
            setCurrentPaymentList,
            setCurrentProjectUsers,
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
