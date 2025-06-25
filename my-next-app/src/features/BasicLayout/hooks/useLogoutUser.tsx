'use client';
import { useRouter } from "next/navigation";

import { auth } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { refreshDemoData } from "@/lib/demoApi";

import { useLoading } from "@/contexts/LoadingContext";

type UseLogoutUserOptions = {
    onSuccess?: (success:boolean) => void;
    onError?: (error: unknown) => void;
};

export function useLogoutUser(options?: UseLogoutUserOptions) {
    const router = useRouter();
    const {logOutUser, userData} = useAuth();
    const { setLoading } = useLoading();

    const handleLogoutUser = async () => {
        try {
            setLoading(true);
            const userAuth = auth.currentUser; 
            if (!userAuth) {
                router.push(`/`);
                throw new Error("尚未登入，無法更新資料");
            }
            
            const uid : string = userData?.uid || "";
            const token = await userAuth.getIdToken();
            if (userData?.uid === 'wfs5LgjSHBVPvGRpGG1ak3py5R83'){
                await refreshDemoData(token, uid);
            }

            const successRegularLogout = await logOutUser();
            if (successRegularLogout){
                options?.onSuccess?.(successRegularLogout);
                return successRegularLogout;
            }

        } catch (error) {
            console.error("Log out failed:", error);
            options?.onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    return { handleLogoutUser };
}
