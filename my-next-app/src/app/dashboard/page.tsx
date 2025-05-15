'use client'

import { withAuth } from "@/utils/withAuth";
import { useRouter } from 'next/navigation';
import { logOutUser } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/useUser";
import Button from "@/components/lib/Button";
import Avatar from "@/components/lib/Avatar";
import Image from 'next/image';
import IconButton from "@/components/lib/IconButton";
import ImageButton from "@/components/lib/ImageButton";
import DashboardNav from "@/features/DashboardNav";
import DashboardHeader from "@/features/DashboardHeader";

function DashboardPage(){
    const {userData, isLoading} = useUser();

    console.log(userData, isLoading)

    return(
        <main className="flex items-start justify-start bg-sp-blue-100">
            <DashboardNav></DashboardNav>
            <div className="py-6 w-full h-screen flex flex-col items-center justify-start gap-2 ">
                <DashboardHeader userData={userData} />

                <div>
                    <div>Welcome to the dashboard!</div>
                </div>
            </div>
        </main>
    )
}

export default withAuth(DashboardPage);