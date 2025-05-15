import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/firebase";
import { getDoc, doc } from "firebase/firestore";

export interface UserData {
    userId: string;
    email: string;
    name: string;
    avatar? : string;
}

export function useUser(){
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
            if (userAuth) {
                const userRef = doc(db, 'users', userAuth.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data() as UserData);
                } else {
                    setUserData(null);
                }
            } else {
                setUserData(null);
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    
    return { userData, isLoading };
}