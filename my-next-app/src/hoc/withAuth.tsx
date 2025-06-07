//保護私人頁面
'use client'
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserData } from "@/types/user";

// Component 是要「被保護」的 React 元件/頁面，如 withAuth(DashboardPage)
export function withAuth<P extends { userData: UserData }>(
    Component: React.ComponentType<P>
  ) {
    return function ProtectedComponent(props: Omit<P, "userData">) {
      const { firebaseUser, userData, isReady } = useAuth();
      const router = useRouter();
      
      useEffect(() => {
        if (!isReady) return;
        if (!firebaseUser || !userData) {
          router.replace("/");
        }
      }, [firebaseUser, userData, isReady, router]);
    
      return firebaseUser && userData ? (
        <Component {...(props as P)} userData={userData} />
      ) : null;
    };
  }