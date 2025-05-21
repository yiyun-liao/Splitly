'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/utils/withAuth";
import { useAuth } from '@/contexts/AuthContext';
import ReceiptList from "@/features/ReceiptList";
import ExpenseOverview from "@/features/ExpenseOverview";

function ExpensePage(){
    const params = useParams();
    const projectId = params.projectId;
    const { firebaseUser, userData, loading } = useAuth();
    

    console.log(userData, loading)
    console.log('projectId:', projectId);

    return(
        <>
            <ReceiptList userData={userData} />
            <ExpenseOverview userData={userData} />
        </>
    )
}

export default withAuth(ExpensePage);