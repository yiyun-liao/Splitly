'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/utils/withAuth";
import { useAuth } from '@/contexts/AuthContext';
import ProjectOverview from "@/features/ProjectOverview";
import PaymentOverview from "@/features/PaymentOverview";


function DashboardPage(){
    const params = useParams();
    const projectId = params.projectId;
    const { firebaseUser, userData, loading } = useAuth();
    

    console.log(`userData: ${userData}, isLoading: ${loading}`)
    //console.log('projectId:', projectId);

    return(
        <>
            <PaymentOverview userData={userData} />
            <ProjectOverview userData={userData} />
        </>
    )
}

export default withAuth(DashboardPage);