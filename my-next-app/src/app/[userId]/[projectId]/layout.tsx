// app/[userId]/[projectId]/layout.tsx
'use client';
import { ReactNode } from "react";
import MobileLayout from "./MobileLayout";
import DesktopLayout from "./DesktopLayout";
import { useTrackLastVisitedProjectPath } from "@/hooks/useTrackLastVisitedProjectPath";

export default function ProjectLayout({ children }: { children: ReactNode }) {
    useTrackLastVisitedProjectPath();

    return (
        <>
            <div className="block md:hidden" style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
                <MobileLayout>{children}</MobileLayout>
            </div>
            <div className="hidden md:block" style={{ height: "calc(var(--vh, 1vh) * 100)" }}>
                <DesktopLayout>{children}</DesktopLayout>
            </div>
        </>
    );
}


