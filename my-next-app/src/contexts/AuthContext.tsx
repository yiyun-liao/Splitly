//全域登入狀態紀錄 用在 my-next-app/src/hoc/withAuth.tsx
'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.js";
import { onAuthStateChanged, User } from "firebase/auth";
import { logInUser, logOutUser } from "@/lib/auth";
import { buildAvatarUrl } from "@/utils/avatar";
import { fetchCurrentUser } from "@/lib/userApi";
import { UserData } from "@/types/user.js";

type AuthContextType = {
    firebaseUser: User | null;     // Firebase 原始 user
    userData: UserData | null;      // 後端取得的完整使用者資料
    loading: boolean;
    logInUser: () => Promise<boolean>;
    logOutUser: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType>({
    firebaseUser: null,
    userData: null,
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
        setFirebaseUser(userAuth);
    
        if (userAuth) {
            try {
                const token = await userAuth.getIdToken();
                const data = await fetchCurrentUser(token, userAuth.uid);
        
                const fullUserData: UserData = {
                    userId: data.userId,
                    email: data.email,
                    name: data.name,
                    uidInAuth: data.uidInAuth,
                    avatarIndex: data.avatar,
                    avatar: buildAvatarUrl(data.avatar),
                };
        
                setUserData(fullUserData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(null);
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
            value={{ firebaseUser, userData, loading, logInUser, logOutUser }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


