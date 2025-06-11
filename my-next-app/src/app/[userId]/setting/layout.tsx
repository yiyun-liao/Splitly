// app/[userId]/setting/layout.tsx
'use client';
import { ReactNode } from "react";
import MobileLayout from "./MobileSettingLayout";
import DesktopLayout from "./DesktopSettingLayout";

export default function SettingLayout({ children }: { children: ReactNode }) {
    return (
        <>
        <div className="block md:hidden" style={{ height: "var(100vh)" }}>
            <MobileLayout>{children}</MobileLayout>
        </div>
        <div className="hidden md:block" style={{ height: "var(100vh)" }}>
            <DesktopLayout>{children}</DesktopLayout>
        </div>
        </>
    );
}