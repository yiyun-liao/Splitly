import { ReactNode } from "react";
import clsx from "clsx";
import MemberNavMobile from "@/features/BasicLayout/MemberNavMobile";
import SettingMemberHeader from "@/features/BasicLayout/SettingMemberHeader";


export default function MobileLayout({ children }: { children: ReactNode }) {

    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")

    return (
        <div className="flex flex-col h-screen overflow-hidden overscroll-none">
            <SettingMemberHeader/>
            <main className={`flex-1 h-full overscroll-none pt-3 px-6 pb-19 ${scrollClass}`}>{children}</main>
            <MemberNavMobile /> 
        </div>
    );
}
