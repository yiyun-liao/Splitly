'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/utils/withAuth";
import { useAuth } from '@/contexts/AuthContext';
import ExpenseOverview from "@/features/ExpenseOverview";
import DashboardMain from "@/features/DashboardMain";


function DashboardPage(){
    const params = useParams();
    const projectId = params.projectId;
    const { firebaseUser, userData, loading } = useAuth();
    

    console.log(`userData: ${userData}, isLoading: ${loading}`)
    //console.log('projectId:', projectId);

    return(
        <>
            <DashboardMain userData={userData} />
            <ExpenseOverview userData={userData} />
        </>
    )
}

export default withAuth(DashboardPage);