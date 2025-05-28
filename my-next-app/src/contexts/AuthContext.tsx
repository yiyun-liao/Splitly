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
import { ProjectData } from "@/types/project";
import { buildProjectCoverUrl } from "@/utils/projectCover";

type AuthContextType = {
    firebaseUser: User | null;     // Firebase 原始 user
    userData: UserData | null;      // 後端取得的完整使用者資料
    loading: boolean;
    logInUser: () => Promise<boolean>;
    logOutUser: () => Promise<boolean>;
    projectData: ProjectData[];
};

export const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    userData: null,
    projectData:[],
    loading: true,
    logInUser: async () => false,
    logOutUser: async () => true,
});


type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
        setFirebaseUser(userAuth);
    
        if (userAuth) {
            try {
                const token = await userAuth.getIdToken();
                const userData = await fetchCurrentUser(token, userAuth.uid);
                const projectData: ProjectData[] = await fetchProjectsByUser(userAuth.uid);
        
                const fullUserData: UserData = {
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.name,
                    uid_in_auth: userData.uid_in_auth,
                    avatar_index: userData.avatar,
                    avatar: buildAvatarUrl(userData.avatar),
                };

                const fullProjectList: ProjectData[] = projectData.map((project) => ({
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
            value={{ firebaseUser, projectData, userData, loading, logInUser, logOutUser }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


