'use client'
import { useParams } from 'next/navigation';
import { withAuth } from "@/utils/withAuth";
import { useUser } from "@/contexts/useUser";
import ReceiptList from "@/features/ReceiptList";
import ExpenseOverview from "@/features/ExpenseOverview";

function ExpensePage(){
    const params = useParams();
    const projectId = params.projectId;
    const {userData, isLoading} = useUser();

    console.log(userData, isLoading)
    console.log('projectId:', projectId);

    return(
        <>
            <ReceiptList userData={userData} />
            <ExpenseOverview userData={userData} />
        </>
    )
}

export default withAuth(ExpensePage);