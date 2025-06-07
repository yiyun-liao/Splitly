// app/[userId]/layout.tsx
'use client';
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalProjectProvider } from "@/contexts/GlobalProjectContext";
import { CategoryProvider } from "@/contexts/CategoryContext";
import { CurrentProjectProvider } from "@/contexts/CurrentProjectContext";
import { AppReadyGuard } from "@/components/layout/AppReadyGuard";

export default function UserLayout({ children }: { children: ReactNode }) {

    return (
        <AuthProvider>
            <GlobalProjectProvider>
                    <CategoryProvider>
                        <CurrentProjectProvider>
                            <AppReadyGuard>
                                {children}
                            </AppReadyGuard>
                        </CurrentProjectProvider>
                    </CategoryProvider>
            </GlobalProjectProvider>
        </AuthProvider>
    );
}