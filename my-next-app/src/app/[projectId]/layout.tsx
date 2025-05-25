'use client';

import { useAuth } from "@/contexts/AuthContext";
import MemberHeader from "@/features/MemberHeader";
import MemberNav from "@/features/MemberNav";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { firebaseUser, userData, loading } = useAuth();

  return (
    <main className="flex items-start justify-center bg-sp-blue-100">
      <MemberNav />
      <div className="py-4 w-full max-w-520 h-screen box-border flex flex-col items-center justify-start gap-2">
        <MemberHeader userData={userData} />
        <div className="flex items-start justify-start box-border px-6 gap-6 w-full h-full overflow-hidden text-zinc-700">
          {children}
        </div>
      </div>
    </main>
  );
}
