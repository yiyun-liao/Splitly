// "use client";
// import { Suspense } from "react";
// import JoinProjectPage from "./JoinClient";
import { LoadingScreen } from '@/components/layout/LoadingScreen';

// export default function JoinPage() {
// return (
//     <Suspense fallback={<LoadingScreen text="載入參加中…" />}>
//         <div style={{ height: "100vh" }}>
//             <JoinProjectPage />
//         </div>
//     </Suspense>
// );
// }

// src/app/(auth)/join/page.tsx
import dynamic from 'next/dynamic'

// 動態載 client component，並在載入時顯示 LoadingScreen
const JoinClient = dynamic(
  () => import('./JoinClient'),
  {
    ssr: false,
    loading: () => <LoadingScreen text="載入參加中…" />,
  }
)

export default function JoinPage() {
  // 既不需要 Suspense，也能確保 useSearchParams() 僅在 client 端執行
  return <JoinClient />
}
