'use client';

import { useAppReady } from "@/hooks/useAppReady";
import { LoadingScreen } from "@/app/[userId]/LoadingScreen";

export function AppReadyGuard({ children }: { children: React.ReactNode }) {
    const isAppReady = useAppReady();

    if (!isAppReady) return <LoadingScreen />;

    return <>{children}</>;
}
