// my-next-app/src/app/(auth)/[userId]/[projectId]/layout.tsx
'use client';
import { ReactNode } from "react";
import MobileLayout from "./MobileLayout";
import DesktopLayout from "./DesktopLayout";
import { useTrackLastVisitedProjectPath } from "@/hooks/useTrackLastVisitedProjectPath";

export default function ProjectLayout({ children }: { children: ReactNode }) {
    useTrackLastVisitedProjectPath();

    return (
        <div style={{ height: "100vh" }}>
            <div className="block md:hidden h-full">
                <MobileLayout>{children}</MobileLayout>
            </div>
            <div className="hidden md:block h-full">
                <DesktopLayout>{children}</DesktopLayout>
            </div>
        </div>
    );
}


