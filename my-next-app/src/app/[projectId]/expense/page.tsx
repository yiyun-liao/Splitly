'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import PaymentList from "@/features/PaymentList";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';
import { UserData } from '@/types/user';


function ExpensePage({ userData }: { userData: UserData }){
    const params = useParams();
    const projectId = params.projectId;
    console.log('projectId:', projectId);

    return(
        <>
            <PaymentList userData={userData} />
            <ProjectOverview />
        </>
    )
}

export default withAuth(ExpensePage);