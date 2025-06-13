import { Suspense } from "react";
import CreateFirstProject from "./CreateFirstProject";
import { LoadingScreen } from '@/components/layout/LoadingScreen';

export default function JoinPage() {
    return (
        <Suspense fallback={<LoadingScreen text="載入中…" />}>
            <div style={{ height: "var(100vh)" }}>
                <CreateFirstProject />
            </div>
        </Suspense>
    );
}
