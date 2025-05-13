//保護私人頁面
'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Component 是要「被保護」的 React 元件/頁面，如 withAuth(DashboardPage)
export const withAuth = (Component:React.ComponentType) => {
    return function ProtectedComponent(props:React.ComponentProps<typeof Component>){
        const {user, loading} = useAuth();
        const router = useRouter();

        useEffect(()=>{
            if (!loading && !user){
                router.push("/");
            }
        }, [user, loading, router]);

        if(loading) return <p>Loading...</p>

        return user ? <Component {...props}/> : null;
    }
}