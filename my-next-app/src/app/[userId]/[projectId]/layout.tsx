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
            <div className="block md:hidden" style={{ height: "var(100vh)" }}>
                <MobileLayout>{children}</MobileLayout>
            </div>
            <div className="hidden md:block" style={{ height: "var(100vh)" }}>
                <DesktopLayout>{children}</DesktopLayout>
            </div>
        </>
    );
}


