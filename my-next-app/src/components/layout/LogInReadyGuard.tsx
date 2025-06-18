'use client';
import { LogInScreen } from "./LogInScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { showInfoToast } from "@/utils/infoToast";



export function LogInReadyGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname(); // 拿到當前路徑
    const isJoinRoute = pathname === "/join";
    const searchParams = useSearchParams();
    const projectId = searchParams.get("pid");
    const router = useRouter()

    const { isLoadedReady:myDataReady, isReady, userData } = useAuth();
    // console.log(`login ing ... authReady: ${myDataReady},projectData: ${projectData}, userData: ${userData}`)

    // 登入失敗：代表已經嘗試過載入（isReady=true），卻拿不到 userData/projectData
    const isLogInFail = isReady && userData === null;

    // 處理 join 頁面
    useEffect(() => {
        if (!isJoinRoute)return
        if (!isReady) return;
        if (!projectId){
            alert('無效的邀請連結，請重新索取或是建立自己的專案！')
            router.push(`/`);
        }

        if (isLogInFail) {
            showInfoToast("加入專案前請先登入");
            const redirect = `/join?pid=${projectId}`;
            router.push(`/?redirect=${encodeURIComponent(redirect)}`);
        }
    }, [isReady, projectId, router, isLogInFail, isJoinRoute]);

    // 還在初始化階段，顯示檢查畫面
    if (!myDataReady) {
        return <LogInScreen text="正在檢查登入狀態…" />;
    }

    return <>{children}</>;
}
