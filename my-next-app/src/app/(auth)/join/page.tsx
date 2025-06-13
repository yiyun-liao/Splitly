import { Suspense } from "react";
import JoinProjectPage from "./JoinClient";

export default function JoinPage() {
return (
    <Suspense fallback={<p>載入參加中...</p>}>
        <div style={{ height: "var(100vh)" }}>
            <JoinProjectPage />
        </div>
    </Suspense>
);
}
