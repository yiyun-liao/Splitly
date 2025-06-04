'use client';
import { ReactNode } from "react";

import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import MobileLayout from "./MobileLayout"; 
import DesktopLayout from "./DesktopLayout"; 

import MemberHeader from "@/features/MemberHeader";
import MemberNav from "@/features/MemberNav";

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
