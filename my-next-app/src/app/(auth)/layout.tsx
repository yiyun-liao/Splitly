"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LogInReadyGuard } from "@/components/layout/LogInReadyGuard";
import { Suspense } from 'react';


export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense>
            <AuthProvider>
                <LogInReadyGuard>
                    {children}
                </LogInReadyGuard>
            </AuthProvider>
        </Suspense>
    );
}