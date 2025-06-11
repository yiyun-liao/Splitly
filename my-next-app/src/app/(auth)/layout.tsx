"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LogInReadyGuard } from "@/components/layout/LogInReadyGuard";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <LogInReadyGuard>
                {children}
            </LogInReadyGuard>
        </AuthProvider>
    );
}