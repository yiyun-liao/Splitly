'use client';
import { useAuth } from "@/contexts/AuthContext"; //用 context 拿 userData 不驗證
import MemberHeader from "@/features/MemberHeader";
import MemberNav from "@/features/MemberNav";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { userData, loading } = useAuth();
  if (loading) return <p>Loading...</p>; // 可加 spinner
  if (!userData) {
    console.error("userData is null");
    return <p>無法取得使用者資料</p>; // 或 return null
  }
    
  return (
    <main className="flex items-start justify-center bg-sp-blue-100">
      <div className="shrink-0 box-border">
        <MemberNav userData={userData}/>
      </div>
      <div className="py-4 w-full max-w-520 h-screen box-border flex flex-col items-center justify-start gap-2">
        <MemberHeader userData={userData} />
        <div className="flex items-start justify-start box-border px-6 gap-6 w-full h-full overflow-hidden text-zinc-700">
          {children}
        </div>
      </div>
    </main>
  );
}
