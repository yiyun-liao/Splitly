'use client';
import { ReactNode } from "react";

import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import MobileLayout from "./MobileLayout"; 
import DesktopLayout from "./DesktopLayout"; 

export default function DashboardLayout({ children }: { children: ReactNode }) {    
    return (
        <GlobalProjectProvider>
            <CategoryProvider>
                <CurrentProjectProvider>
                    <div className="block md:hidden"><MobileLayout>{children}</MobileLayout></div>
                    <div className="hidden md:block"><DesktopLayout>{children}</DesktopLayout></div>
                </CurrentProjectProvider>
            </CategoryProvider>
        </GlobalProjectProvider>
    )

}

// export default function DashboardLayout({ children }: { children: ReactNode }) {    
//     const isMobile = useIsMobile();
//     if (typeof window !== "undefined" && isMobile === undefined) return null;

//     return isMobile ? 
//         <MobileLayout>{children}</MobileLayout> : 
//         <DesktopLayout>{children}</DesktopLayout>;    
// }
