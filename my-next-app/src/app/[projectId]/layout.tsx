'use client';

import { useUser } from "@/contexts/useUser";
import DashboardHeader from "@/features/DashboardHeader";
import DashboardNav from "@/features/DashboardNav";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { userData } = useUser();

  return (
    <main className="flex items-start justify-center bg-sp-blue-100">
      <DashboardNav />
      <div className="py-4 w-full max-w-520 h-screen flex flex-col items-center justify-start gap-2">
        <DashboardHeader userData={userData} />
        <div className="flex items-start justify-start px-6 gap-6 w-full h-full overflow-hidden text-zinc-700">
          {children}
        </div>
      </div>
    </main>
  );
}
