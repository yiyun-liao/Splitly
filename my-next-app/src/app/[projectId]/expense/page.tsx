'use client'
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import PaymentList from "@/features/PaymentList";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';


function ExpensePage(){

    return(
        <>
            <PaymentList/>
            <ProjectOverview />
        </>
    )
}

export default withAuth(ExpensePage);