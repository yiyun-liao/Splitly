// "use client";
// import { Suspense } from "react";
import JoinProjectPage from "./JoinClient";
import ClientOnly from "@/components/ClientOnly";
import { LoadingScreen } from "@/components/layout/LoadingScreen";


export default function JoinPage() {
return (
    <ClientOnly>
        <div style={{ height: "100vh" }}>
            <JoinProjectPage />
        </div>
    </ClientOnly>
);
}
