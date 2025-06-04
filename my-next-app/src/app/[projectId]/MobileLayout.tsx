import { ReactNode } from "react";
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import clsx from "clsx";
import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import MemberNavMobile from "@/features/BasicLayout/MemberNavMobile";
import MemberHeaderMobile from "@/features/BasicLayout/MemberHeaderMobile";

export default function MobileLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { projectId } = useParams();

    const [activePath, setActivePath] = useState(pathname); // 對應當前功能頁面渲染按鈕

    useEffect(() => {
    setActivePath(pathname);
    }, [pathname]);

    const isMobileClass = clsx("flex flex-col h-screen overflow-hidden overscroll-none",
        {
            "bg-sp-green-300": pathname === `/${projectId}/expense`,
            "bg-sp-blue-100 ": pathname !== `/${projectId}/expense`
        }
    )
    return (
        <GlobalProjectProvider>
        <CategoryProvider>
            <CurrentProjectProvider>
            <div className={isMobileClass}>
                <MemberHeaderMobile/>
                <main className="flex-1 h-full overscroll-none py-13 px-6">{children}</main>
                <MemberNavMobile /> 
            </div>
            </CurrentProjectProvider>
        </CategoryProvider>
        </GlobalProjectProvider>
    );
}
