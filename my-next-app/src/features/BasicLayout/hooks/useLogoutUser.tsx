'use client';
import { useRouter } from "next/navigation";

import { auth } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { refreshDemoData } from "@/lib/demoApi";

import { useLoading } from "@/contexts/LoadingContext";
import toast from 'react-hot-toast';


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
                // 直接 fire-and-forget，不用 await
                refreshDemoData(token, uid)
                .then(() => {
                    toast.success('Refresh Success')
                    console.log("Demo data refresh kicked off")
                })
                .catch(err => console.error("Demo refresh failed", err));
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
