"use client";
import { Suspense } from "react";
import JoinProjectPage from "./JoinClient";
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function JoinPage() {
return (
    <Suspense fallback={<LoadingScreen text="載入參加中…" />}>
        <div style={{ height: "100vh" }}>
            <JoinProjectPage />
        </div>
    </Suspense>
);
}

