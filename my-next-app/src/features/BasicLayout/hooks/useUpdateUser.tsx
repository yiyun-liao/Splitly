import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

import { UserData } from "@/types/user";
import { updateUser } from "@/lib/userApi";
import { buildAvatarUrl } from "@/utils/getAvatar";
import { updateAllCachedProjectUsers } from "@/utils/cache";

type UseUpdateUserOptions = {
    onSuccess?: (payment: UserData) => void;
    onError?: (error: unknown) => void;
};

export function useUpdateUser(options?: UseUpdateUserOptions) {
    const router = useRouter();
    const { setUserData } = useAuth(); 
    const { setCurrentProjectUsers } = useCurrentProjectData();
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

            if (result.success && result.user) {
                if (setUserData && setCurrentProjectUsers) {
                    const fullUser: UserData = {
                        ...result.user,
                        avatarURL: buildAvatarUrl(result.user.avatar),
                    };
                    setUserData?.(() => fullUser);

                    setCurrentProjectUsers?.((prev) =>
                        prev?.map(u => u.uid === fullUser.uid ? fullUser : u)
                    );

                    // 同步更新 localStorage 快取
                    const myKey = `👀 myData:${data.uid}`;
                    const myMetaKey = `👀 cacheMyMeta:${data.uid}`;
                    try {
                        localStorage.setItem(myKey, JSON.stringify(fullUser));
                        localStorage.setItem(myMetaKey, JSON.stringify({ timestamp: Date.now() }));
                    } catch (e) {
                        console.warn("⚠️ 快取更新失敗", e);
                    }                    
                    updateAllCachedProjectUsers(fullUser);
                    options?.onSuccess?.(fullUser);
                    return fullUser;
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
