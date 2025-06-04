'use client';
import { ReactNode } from "react";

import MobileLayout from "./MobileLayout"; 
import DesktopLayout from "./DesktopLayout"; 

export default function DashboardLayout({ children }: { children: ReactNode }) {    
    return (
        <>
            <div className="block md:hidden"><MobileLayout>{children}</MobileLayout></div>
            <div className="hidden md:block"><DesktopLayout>{children}</DesktopLayout></div>
        </>
    )

}

// export default function DashboardLayout({ children }: { children: ReactNode }) {    
//     const isMobile = useIsMobile();
//     if (typeof window !== "undefined" && isMobile === undefined) return null;

//     return isMobile ? 
//         <MobileLayout>{children}</MobileLayout> : 
//         <DesktopLayout>{children}</DesktopLayout>;    
// }
