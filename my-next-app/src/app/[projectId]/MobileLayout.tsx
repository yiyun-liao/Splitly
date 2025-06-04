import { ReactNode } from "react";
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import clsx from "clsx";
import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import MemberNavMobile from "@/features/MemberNavMobile";
import MemberHeaderMobile from "@/features/MemberHeaderMobile";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function MobileLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { projectId } = useParams();

    const [activePath, setActivePath] = useState(pathname); // 對應當前功能頁面渲染按鈕
    const [isCreateProject, setIsCreateProject]= useState(false);

    useEffect(() => {
    setActivePath(pathname);
    }, [pathname]);

    const isMobile = useIsMobile();
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
                <main className="flex-1 overflow-y-auto overscroll-none py-13 px-6">{children}</main>
                <MemberNavMobile /> 
            </div>
            </CurrentProjectProvider>
        </CategoryProvider>
        </GlobalProjectProvider>
    );
}
