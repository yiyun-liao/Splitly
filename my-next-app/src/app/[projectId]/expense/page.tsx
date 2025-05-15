'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/utils/withAuth";
import { useRouter } from 'next/navigation';
import { logOutUser } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/useUser";
import Button from "@/components/lib/Button";
import Avatar from "@/components/lib/Avatar";
import Icon from "@/components/lib/Icon";
import Image from 'next/image';
import IconButton from "@/components/lib/IconButton";
import ImageButton from "@/components/lib/ImageButton";
import DashboardNav from "@/features/DashboardNav";
import DashboardHeader from "@/features/DashboardHeader";
import ExpenseList from "@/features/ExpenseList";
import ExpenseOverview from "@/features/ExpenseOverview";

function DashboardPage(){
    const params = useParams();
    const projectId = params.projectId;
    const {userData, isLoading} = useUser();

    console.log(userData, isLoading)
    console.log('projectId:', projectId);

    return(
        <main className="flex items-start justify-center bg-sp-blue-100">
            <DashboardNav />
            <div className="py-4 w-full max-w-520 h-screen flex flex-col items-center justify-start gap-2 ">
                <DashboardHeader userData={userData} />
                <div className="flex items-start justify-start px-6 gap-6 w-full h-full overflow-hidden text-zinc-700 ">
                    <ExpenseList userData={userData}  />
                    <ExpenseOverview userData={userData}  />
                </div>
            </div>
        </main>
    )
}

export default withAuth(DashboardPage);