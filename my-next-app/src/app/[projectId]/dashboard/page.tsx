'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/utils/withAuth";
import { useUser } from "@/contexts/useUser";
import ExpenseOverview from "@/features/ExpenseOverview";
import ProjectAnalysis from "@/features/ProjectAnalysis";


function DashboardPage(){
    const params = useParams();
    const projectId = params.projectId;
    const {userData, isLoading} = useUser();

    console.log(userData, isLoading)
    console.log('projectId:', projectId);

    return(
        <>
            <ProjectAnalysis userData={userData} />
            <ExpenseOverview userData={userData} />
        </>
    )
}

export default withAuth(DashboardPage);