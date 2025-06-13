'use client';
import { useRouter } from "next/navigation";

import { auth } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

import { UserData } from "@/types/user";
import { updateUser } from "@/lib/userApi";
import { buildAvatarUrl } from "@/utils/getAvatar";
import { updateAllCachedProjectUsers } from "@/utils/cache";

import { useLoading } from "@/contexts/LoadingContext";
import toast from "react-hot-toast";

type UseUpdateUserOptions = {
    onSuccess?: (payment: UserData) => void;
    onError?: (error: unknown) => void;
};

export function useUpdateUser(options?: UseUpdateUserOptions) {
    const router = useRouter();
    const { setUserData } = useAuth(); 
    const { setCurrentProjectUsers } = useCurrentProjectData();
    const { setLoading } = useLoading();

    const handleUpdateUser = async (data: UserData) => {
        const toastId = toast.loading("更新中…");

        try {
            setLoading(true);
            const userAuth = auth.currentUser; 
            if (!userAuth) {
                router.push(`/`);
                throw new Error("尚未登入，無法更新資料");
            }

            const token = await userAuth.getIdToken();
            const result = await updateUser(token, data.uid, data);

            if (!result.success){
                throw new Error("伺服器回傳格式不正確");
            }

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

                    toast.success("更新成功！", { id: toastId });
                    options?.onSuccess?.(fullUser);
                    return fullUser;
                }
            } 
        } catch (error) {
            toast.error("更新失敗，請稍後再試", { id: toastId });
            console.error("Update user data failed:", error);
            options?.onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    return { handleUpdateUser };
}
