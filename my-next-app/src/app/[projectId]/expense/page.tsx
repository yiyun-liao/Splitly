'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/utils/withAuth";
import { useAuth } from '@/contexts/AuthContext';
import PaymentList from "@/features/PaymentList";
import ProjectOverview from "@/features/ProjectOverview";

function ExpensePage(){
    const params = useParams();
    const projectId = params.projectId;
    const { firebaseUser, userData, loading } = useAuth();
    

    console.log(userData, loading)
    console.log('projectId:', projectId);

    return(
        <>
            <PaymentList userData={userData} />
            <ProjectOverview userData={userData} />
        </>
    )
}

export default withAuth(ExpensePage);