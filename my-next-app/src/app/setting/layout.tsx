'use client';
import { ReactNode } from "react";

import DesktopLayout from "./DesktopSettingLayout"; 
import MobileLayout from "./MobileSettingLayout";
import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";

export default function DashboardLayout({ children }: { children: ReactNode }) {    
    return (
        <GlobalProjectProvider>
            <CategoryProvider>
                <div className="block md:hidden"><MobileLayout>{children}</MobileLayout></div>
                <div className="hidden md:block"><DesktopLayout>{children}</DesktopLayout></div>
            </CategoryProvider>
        </GlobalProjectProvider>
    )

}