'use client';
import { ReactNode } from "react";
import { useState } from "react";

import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";

import MemberHeader from "@/features/BasicLayout/MemberHeader";
import MemberNav from "@/features/BasicLayout/MemberNav";


export default function DashboardLayout({ children }: { children: ReactNode }) {  
    const [navWidth, setNavWidth] = useState(72);  
    return (
        <GlobalProjectProvider>
            <CategoryProvider>
                <CurrentProjectProvider>
                    <main className="flex items-start justify-center overflow-x-hidden w-screen h-screen  bg-sp-blue-100">
                        <div className="shrink-0 box-border" style={{ width: navWidth }}>
                            <MemberNav setNavWidth={setNavWidth} />
                        </div>
                        <div 
                            className="py-4 h-full box-border flex flex-col items-center justify-start gap-2"
                            style={{ width: `calc(100vw - ${navWidth}px)`, maxWidth: 2080 }}
                        >
                            <MemberHeader/>
                            <div className="flex items-start justify-start box-border px-6 gap-6 w-full h-full overflow-hidden text-zinc-700">
                                {children}
                            </div>
                        </div>
                    </main>
                </CurrentProjectProvider>
            </CategoryProvider>
        </GlobalProjectProvider>
    );
}
