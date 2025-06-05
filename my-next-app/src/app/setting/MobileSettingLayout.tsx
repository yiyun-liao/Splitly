import { ReactNode } from "react";
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import clsx from "clsx";
import MemberNavMobile from "@/features/BasicLayout/MemberNavMobile";
import SettingMemberHeader from "@/features/BasicLayout/SettingMemberHeader";


export default function MobileLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { projectId } = useParams();

    const [activePath, setActivePath] = useState(pathname); // 對應當前功能頁面渲染按鈕

    useEffect(() => {
    setActivePath(pathname);
    }, [pathname]);

    return (
        <div className="flex flex-col h-screen overflow-hidden overscroll-none">
            <SettingMemberHeader/>
            <main className="flex-1 h-full overscroll-none py-13 px-6">{children}</main>
            <MemberNavMobile /> 
        </div>
    );
}
