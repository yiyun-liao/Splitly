import { Suspense } from "react";
import CreateFirstProject from "./CreateFirstProject";

export default function JoinPage() {
    return (
        <Suspense fallback={<p>轉去建立第一個專案中...</p>}>
            <div style={{ height: "var(100vh)" }}>
                <CreateFirstProject />
            </div>
        </Suspense>
    );
}
