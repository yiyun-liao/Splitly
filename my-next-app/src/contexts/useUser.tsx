import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import { buildAvatarUrl } from "@/utils/avatar";

export interface UserData {
    userId: string;
    email: string;
    name: string;
    uidInAuth?:string;
    avatar?: string; // 最後是 Cloudinary URL
    avatarIndex?: number; // 後端回傳的 avatar index
}

export function useUser() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
        if (userAuth) {
          try {
            const token = await userAuth.getIdToken();
            const res = await fetch(
              `/api/auth/getUser?userId=${userAuth.uid}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!res.ok) {
              throw new Error("Failed to fetch user data");
            }
  
            const data = await res.json();
  
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
  
    return { userData, isLoading };
  }