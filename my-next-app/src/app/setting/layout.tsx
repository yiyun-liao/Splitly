'use client';
import { ReactNode } from "react";
import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import DesktopLayout from "./DesktopSettingLayout"; 
import MobileLayout from "./MobileSettingLayout";
import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {  
    const { userData,  isReady } = useAuth();

    useEffect(() => {
        if (!isReady || !userData) return;
    }, [isReady, userData]);

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