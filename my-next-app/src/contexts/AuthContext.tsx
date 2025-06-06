//全域登入狀態紀錄 用在 my-next-app/src/hoc/withAuth.tsx
'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.js";
import { onAuthStateChanged, User } from "firebase/auth";
import { logInUser, logOutUser } from "@/lib/auth";

import { fetchCurrentUser } from "@/lib/userApi";
import { UserData } from "@/types/user.js";
import { buildAvatarUrl } from "@/utils/getAvatar";

import { fetchProjectsByUser } from "@/lib/projectApi";
import { GetProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/getProjectCover";

type AuthContextType = {
    firebaseUser: User | null;     // Firebase 原始 user
    userData: UserData | null;      // 後端取得的完整使用者資料
    isReady: boolean;
    logInUser: () => Promise<boolean>;
    logOutUser: () => Promise<boolean>;
    projectData: GetProjectData[];
    addProject: (project: GetProjectData) => void;
};

export const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    userData: null,
    projectData:[],
    isReady: false,
    logInUser: async () => false,
    logOutUser: async () => true,
    addProject: () => {}
});


type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [projectData, setProjectData] = useState<GetProjectData[]>([]);
    const [isReady, setIsReady] = useState(false);

    const addProject = (newProject: GetProjectData) => {
        setProjectData(prev => [...prev, newProject]);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            setFirebaseUser(userAuth);
            setIsReady(false); // 🔄 新使用者載入 → 重新準備
            if (!userAuth) {
                setUserData(null);
                setProjectData([]);
                setIsReady(true); // ✅ 已確認無登入
                return;
            }
    
            const uid = userAuth.uid;
            const myKey = `👀 myData:${uid}`;
            const projectKey = `👀 myProjectList:${uid}`;
            const myMetaKey = `👀 cacheMyMeta:${uid}`;
            const CACHE_TTL = 1000 * 60 * 180;
        
            const cachedMyData = localStorage.getItem(myKey);
            const cachedProjects = localStorage.getItem(projectKey);
            const cachedMeta = localStorage.getItem(myMetaKey);
            const isCacheExpired = !cachedMeta || Date.now() - JSON.parse(cachedMeta).timestamp > CACHE_TTL;
        
            if (cachedMyData && cachedProjects && !isCacheExpired) {
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
        try {
            console.log("🙃 fetch my data")
            const token = await userAuth.getIdToken();
            const rawUser = await fetchCurrentUser(token, uid);
            const rawProjects = await fetchProjectsByUser(token, uid);
    
            const fullUser: UserData = {
                ...rawUser,
                avatarURL: buildAvatarUrl(rawUser.avatar),
            };
    
            const fullProjects: GetProjectData[] = rawProjects.map((project:GetProjectData) => ({
                ...project,
                imgURL: buildProjectCoverUrl(project.img),
            }));
    
            setUserData(fullUser);
            setProjectData(fullProjects);
    
            localStorage.setItem(myKey, JSON.stringify(fullUser));
            localStorage.setItem(projectKey, JSON.stringify(fullProjects));
            localStorage.setItem(myMetaKey, JSON.stringify({ timestamp: Date.now() }));
    
            setIsReady(true); // ✅ fetch 成功
        } catch (error) {
            console.error("🔴 Error fetching user data:", error);
            setUserData(null);
            setProjectData([]);
            setIsReady(true); // ✅ 即使失敗，也標記完成（避免卡住）
        } 
        });
    
        return () => unsubscribe();
    }, []);
    
    return (
        <AuthContext.Provider
            value={{ firebaseUser, projectData, userData, isReady, logInUser, logOutUser,addProject, }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


