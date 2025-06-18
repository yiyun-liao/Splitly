// "use client";
import { Suspense } from "react";
// import JoinProjectPage from "./JoinClient";
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import dynamic from "next/dynamic";

// dynamically import the client-only component
const JoinClient = dynamic(() => import("./JoinClient"), {
    ssr: false,
});

export default function JoinPage() {
return (
    <Suspense fallback={<LoadingScreen text="載入參加中…" />}>
        <div style={{ height: "100vh" }}>
            <JoinClient />
        </div>
    </Suspense>
);
}
