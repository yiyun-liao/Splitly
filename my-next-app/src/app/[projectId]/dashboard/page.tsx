'use client'
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import PaymentOverview from "@/features/PaymentOverview";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';


function DashboardPage(){
    return(
        <>
            <PaymentOverview />
            <ProjectOverview />
        </>
    )
}

export default withAuth(DashboardPage);