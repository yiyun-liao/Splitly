//全域登入狀態紀錄
'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, signOut, getAdditionalUserInfo } from "firebase/auth";
import { auth } from "../firebase.js";
import { getRandomAvatarIndex } from "@/utils/avatar";
import { syncUserToBackend } from "@/lib/userApi.jsx";
import { logInUser, logOutUser } from "@/lib/auth";

type AuthContextType = {
    user: User | null ;
    loading: boolean;
    logInUser: () => Promise<boolean>;
    logOutUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading:true,
    logInUser: async () => false,
    logOutUser: async () => {},
});

type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        })

        return () => unsubscribe();
    }, [])
    return(
        <AuthContext.Provider value={{ user, loading, logInUser, logOutUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);


