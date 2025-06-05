import { Suspense } from "react";
import CreateFirstProject from "./CreateFirstProject";

export default function JoinPage() {
  return (
    <Suspense fallback={<p>載入中...</p>}>
      <div style={{ height: "var(--vh)" }}>
        <CreateFirstProject />
      </div>
    </Suspense>
  );
}
