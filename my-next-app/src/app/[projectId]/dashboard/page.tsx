'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import PaymentOverview from "@/features/PaymentOverview";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';
import { UserData } from '@/types/user';


function DashboardPage({ userData }: { userData: UserData }){
    const params = useParams();
    const projectId = params.projectId;
    console.log('projectId:', projectId);

    return(
        <>
            <PaymentOverview userData={userData} />
            <ProjectOverview userData={userData} />
        </>
    )
}

export default withAuth(DashboardPage);