//全域登入狀態紀錄 用在 my-next-app/src/hoc/withAuth.tsx
'use client'
import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import { useRouter, usePathname} from "next/navigation";
import toast from "react-hot-toast";
import { auth } from "../firebase.js";
import { onAuthStateChanged, User } from "firebase/auth";
import { logInUser, logOutUser as signOutFromLib } from "@/lib/auth";

import { fetchCurrentUser } from "@/lib/userApi";
import { UserData } from "@/types/user.js";
import { buildAvatarUrl } from "@/utils/getAvatar";

import { fetchProjectsByUser } from "@/lib/projectApi";
import { GetProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";

import { clearUserCache } from "@/utils/cache";

type AuthContextType = {
    firebaseUser: User | null;     // Firebase 原始 user
    userData: UserData | null;      // 後端取得的完整使用者資料
    isReady: boolean;
    isLoadedReady: boolean;
    logInUser: () => Promise<boolean>;
    logOutUser: () => Promise<boolean>;
    projectData: GetProjectData[];
    addProject: (project: GetProjectData) => void;
    setUserData?: React.Dispatch<React.SetStateAction<UserData | null>>; 
    setProjectData?: React.Dispatch<React.SetStateAction<GetProjectData[] | []>>;
    
};

export const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    userData: null,
    projectData:[],
    isReady: false,
    isLoadedReady:false,
    logInUser: async () => false,
    logOutUser: async () => true,
    addProject: () => {},
    setUserData: () => {},
    setProjectData: () => {},
});


type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [projectData, setProjectData] = useState<GetProjectData[]>([]);
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    const pathname = usePathname(); // 拿到當前路徑
    const isJoinRoute = pathname === "/join"; //如果是 join 讓 LoginReadyGuard 處理

    const manualLogoutRef = useRef(false);

    const contextLogOutUser = async () => {
        manualLogoutRef.current = true;
        return await signOutFromLib(); //回到頁面，頁面要處理個別 toast
    };


    const addProject = (newProject: GetProjectData) => {
        setProjectData(prev => [...prev, newProject]);
    };

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            setFirebaseUser(userAuth);
            // console.log(userAuth)
            setIsReady(false); // 🔄 新使用者載入 → 重新準備

            if (!userAuth) {
                setUserData(null);
                setProjectData([]);
                setIsReady(true);
                if (!manualLogoutRef.current) {
                    if (isJoinRoute) {
                        return null;
                    } else {
                        toast.error("權限失敗，請重新登入");
                        console.log('Can not get auth, plz try again');
                        manualLogoutRef.current = false;

                        const success = await signOutFromLib();
                        if (success){
                            clearUserCache();
                            router.replace('/');    
                        }
                    }
                }
                return null;
            }
    
            const uid = userAuth.uid;
            const myKey = `👀 myData:${uid}`;
            const projectKey = `👀 myProjectList:${uid}`;
            const myMetaKey = `👀 cacheMyMeta:${uid}`;
            const CACHE_TTL = 1000 * 60 * 60;

            const isPageReload = typeof window !== 'undefined' &&
                (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';
        
            const cachedMyData = localStorage.getItem(myKey);
            const cachedProjects = localStorage.getItem(projectKey);
            const cachedMeta = localStorage.getItem(myMetaKey);
            const isCacheExpired = !cachedMeta || Date.now() - JSON.parse(cachedMeta).timestamp > CACHE_TTL;
            // console.log("👉🏻isCacheExpired", isCacheExpired ,"isPageReload" ,isPageReload)

            if (cachedMyData && cachedProjects && !isCacheExpired && !isPageReload) {
                try {
                    setUserData(JSON.parse(cachedMyData));
                    setProjectData(JSON.parse(cachedProjects));
                    setIsReady(true); // ✅ 快取完成
                    return;
                } catch (error) {
                    console.warn("❌ Failed to parse cache, clearing...", error);
                    localStorage.removeItem(myKey);
                    localStorage.removeItem(projectKey);
                    localStorage.removeItem(myMetaKey);
                }
            }
    
            setIsReady(false);

            const fetchAndSetUser = async (retry = false) => {
                try {
                    // console.log("🙃 fetch my data")
                    const token = await userAuth.getIdToken();
                    const rawUser = await fetchCurrentUser(token, uid); // ⛔ 可能在這邊 fail
                    const rawProjects = await fetchProjectsByUser(token, uid);
    
                    const fullUser: UserData = {
                        ...rawUser,
                        avatarURL: buildAvatarUrl(rawUser.avatar),
                    };
    
                    const fullProjects: GetProjectData[] = rawProjects.map((project: GetProjectData) => ({
                        ...project,
                        imgURL: buildProjectCoverUrl(project.img),
                    }));
    
                    setUserData(fullUser);
                    setProjectData(fullProjects);
    
                    // cache
                    localStorage.setItem(`👀 myData:${uid}`, JSON.stringify(fullUser));
                    localStorage.setItem(`👀 myProjectList:${uid}`, JSON.stringify(fullProjects));
                    localStorage.setItem(`👀 cacheMyMeta:${uid}`, JSON.stringify({ timestamp: Date.now() }));
    
                    setIsReady(true);
                } catch (error) {
                    // console.error("🔴 Error fetching user data:", error);
                    if (!retry) {
                        console.log("⏳ Token might be too early, retrying in 2s...");
                        setTimeout(() => fetchAndSetUser(true), 2000); // retry once
                    } else {
                        console.warn("🛑 Retry failed, fallback to null", error);
                        toast.error('驗證過程發生錯誤，請重新登入或更新網頁')
                        setUserData(null);
                        setProjectData([]);
                        setIsReady(true);
                        router.push('/')
                    }
                }
            };
            // 👉 啟動 fetch
            fetchAndSetUser();
        });
        
        return () => unsubscribe();
    },[]);

    const isLoadedReady = useMemo(() => {
        return !!firebaseUser && !!userData && !!projectData;
      }, [firebaseUser, userData, projectData]);

    // console.log(isReady, isLoadedReady, firebaseUser, userData)
    
    return (
        <AuthContext.Provider
            value={{ 
                firebaseUser, 
                projectData, 
                userData, 
                isLoadedReady,
                isReady, 
                logInUser, 
                logOutUser: contextLogOutUser,
                addProject, 
                setUserData,
                setProjectData
            }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


