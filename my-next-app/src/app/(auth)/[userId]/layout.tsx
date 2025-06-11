// my-next-app/src/app/(auth)/[userId]/layout.tsx
'use client';
import { ReactNode } from "react";
import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { LoadingReadyGuard } from "@/components/layout/LoadingReadyGuard";

export default function UserLayout({ children }: { children: ReactNode }) {

    return (
        <GlobalProjectProvider>
            <CurrentProjectProvider>
                <LoadingReadyGuard>
                    {children}
                </LoadingReadyGuard>
            </CurrentProjectProvider>
        </GlobalProjectProvider>
    );
}