import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { buildAvatarUrl } from "@/utils/avatar";

export interface UserData {
    userId: string;
    email: string;
    name: string;
    uidInAuth?:string;
    avatar?: string; // 最後是 Cloudinary URL
    avatarIndex?: number; // Firestore 中實際存的是 index
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
                    const data = userSnap.data();
                    const avatarIndex = data.avatar;

                    const fullUserData: UserData = {
                        userId: userAuth.uid,
                        email: data.email,
                        name: data.name,
                        uidInAuth:data.uidInAuth,
                        avatarIndex,
                        avatar: buildAvatarUrl(avatarIndex), 
                    };

                    setUserData(fullUserData);
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