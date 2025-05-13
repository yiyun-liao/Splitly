//全域登入狀態紀錄
'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, signOut, getAdditionalUserInfo } from "firebase/auth";
import { auth, provider, db } from "../firebase.js";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

type AuthContextType = {
    user: User | null ;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading:true,
});

export const AuthProvider = ({children}:{children:React.ReactNode}) => {
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
        <AuthContext.Provider value= {{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);


export async function logInUser() {
    try {
        const result = await signInWithPopup(auth, provider);
        const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
        if (isNewUser){
            await setDoc(doc(db, 'users', result.user.uid), {
                name: result.user.displayName,
                email: result.user.email,
                createdAt: serverTimestamp(),
            });
        }
        console.log(result.user)
        return true;
    } catch (error) {
        console.error("Log in error:", error);
        return false;
    }
}

export async function logOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout error:", error);
    }
}