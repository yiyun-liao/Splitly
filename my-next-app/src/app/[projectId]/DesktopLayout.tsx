'use client';
import { ReactNode } from "react";

import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";

import MemberHeader from "@/features/MemberHeader";
import MemberNav from "@/features/MemberNav";


export default function DashboardLayout({ children }: { children: ReactNode }) {    
    return (
        <GlobalProjectProvider>
            <CategoryProvider>
                <CurrentProjectProvider>
                    <main className="flex items-start justify-center bg-sp-blue-100">
                        <div className="shrink-0 box-border">
                            <MemberNav/>
                        </div>
                        <div className="py-4 w-full max-w-520 h-screen box-border flex flex-col items-center justify-start gap-2">
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
