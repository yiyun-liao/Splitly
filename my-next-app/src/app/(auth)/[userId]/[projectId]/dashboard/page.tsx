'use client'
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import PaymentOverview from "@/features/PaymentOverview";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';
import { useIsMobile } from "@/hooks/useIsMobile";


function DashboardPage(){
    const isMobile = useIsMobile();  
    return( isMobile ? 
        (<>
            <PaymentOverview />
        </>) : 
        (<>
            <PaymentOverview />
            <ProjectOverview />
        </>) 
    )
}

export default withAuth(DashboardPage);