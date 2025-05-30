import { Suspense } from "react";
import JoinProjectPage from "./JoinClient";

export default function JoinPage() {
  return (
    <Suspense fallback={<p>載入中...</p>}>
      <JoinProjectPage />
    </Suspense>
  );
}
