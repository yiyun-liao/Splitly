//全域登入狀態紀錄 用在 my-next-app/src/hoc/withAuth.tsx
'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.js";
import { onAuthStateChanged, User } from "firebase/auth";
import { logInUser, logOutUser } from "@/lib/auth";

import { fetchCurrentUser } from "@/lib/userApi";
import { UserData } from "@/types/user.js";
import { buildAvatarUrl } from "@/utils/avatar";

import { fetchProjectsByUser } from "@/lib/projectApi";
import { GetProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/projectCover";

type AuthContextType = {
    firebaseUser: User | null;     // Firebase 原始 user
    userData: UserData | null;      // 後端取得的完整使用者資料
    loading: boolean;
    logInUser: () => Promise<boolean>;
    logOutUser: () => Promise<boolean>;
    projectData: GetProjectData[];
    addProject: (project: GetProjectData) => void;
};

export const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    userData: null,
    projectData:[],
    loading: true,
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
    const [loading, setLoading] = useState(true);
    const addProject = (newProject: GetProjectData) => {
        setProjectData(prev => [...prev, newProject]);
    };
    useEffect(() => {
        let fetched = false;

        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
        setFirebaseUser(userAuth);
        if (fetched) return;
        fetched = true;
        console.log("✅ running onAuthStateChanged fetcher"); 

        if (userAuth) {
            try {
                const token = await userAuth.getIdToken();
                const userData = await fetchCurrentUser(token, userAuth.uid);
                const projectData: GetProjectData[] = await fetchProjectsByUser(token, userAuth.uid);
        
                const fullUserData: UserData = {
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.name,
                    uid_in_auth: userData.uid_in_auth,
                    avatar_index: userData.avatar,
                    avatar: buildAvatarUrl(userData.avatar),
                };

                const fullProjectList: GetProjectData[] = projectData.map((project) => ({
                    ...project,
                    imgURL: buildProjectCoverUrl(project.img),
                  }));


                console.log("what i get userData",fullUserData)
                console.log("what i get projectData",fullProjectList)

                setUserData(fullUserData);
                setProjectData(fullProjectList);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(null);
                setProjectData([])
            }
        } else {
            setUserData(null);
        }
    
        setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    
    return (
        <AuthContext.Provider
            value={{ firebaseUser, projectData, userData, loading, logInUser, logOutUser,addProject, }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


