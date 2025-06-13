'use client';
import clsx from "clsx";
import { ReactNode } from "react";
import { useState } from "react";

import MemberNav from "@/features/BasicLayout/MemberNav";
import SettingMemberHeader from "@/features/BasicLayout/SettingMemberHeader";


export default function DashboardLayout({ children }: { children: ReactNode }) {  
    const [navWidth, setNavWidth] = useState(72);  
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    
    return (
        <main className="flex items-start justify-center overflow-x-hidden w-screen h-full  bg-sp-blue-100">
            <div className="shrink-0 box-border" style={{ width: navWidth }}>
                <MemberNav setNavWidth={setNavWidth} />
            </div>
            <div 
                className="py-4 h-full box-border flex flex-col items-center justify-start gap-2"
                style={{ width: `calc(100vw - ${navWidth}px)`, maxWidth: 2080 }}
            >
                <SettingMemberHeader/>
                <div className={`flex-1 items-start justify-start box-border px-6 gap-6 w-full h-full text-zinc-700 ${scrollClass}`}>
                    {children}
                </div>
            </div>
        </main>
    );
}
