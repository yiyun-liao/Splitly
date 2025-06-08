import { useState } from "react";
import { UserData } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { updateUser } from "@/lib/userApi";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";


type UseUpdateUserOptions = {
    onSuccess?: (payment: UserData) => void;
    onError?: (error: unknown) => void;
};

export function useUpdateUser(options?: UseUpdateUserOptions) {
    const router = useRouter();
    const { setUserData } = useAuth(); 
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateUser = async (data: UserData) => {
        try {
            setIsLoading(true);
            const userAuth = auth.currentUser; 
            if (!userAuth) {
                router.push(`/`);
                throw new Error("尚未登入，無法更新資料");
            }

            const token = await userAuth.getIdToken();
            const result = await updateUser(token, data.uid, data);

            if (result.success) {
                if (setUserData) {
                    setUserData?.(() => result.data);

                    // 同步更新 localStorage 快取
                    const myKey = `👀 myData:${data.uid}`;
                    const myMetaKey = `👀 cacheMyMeta:${data.uid}`;
                    try {
                        localStorage.setItem(myKey, JSON.stringify(result.data));
                        localStorage.setItem(myMetaKey, JSON.stringify({ timestamp: Date.now() }));
                    } catch (e) {
                        console.warn("⚠️ 快取更新失敗", e);
                    }                    
                    options?.onSuccess?.(result.data);
                    return result.data;
                }
            } else {
                console.error("⚠️ createPayment 回傳格式不符合預期", result);
            }
        } catch (error) {
            console.error("Create payment failed:", error);
            options?.onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleUpdateUser, isLoading };
}
