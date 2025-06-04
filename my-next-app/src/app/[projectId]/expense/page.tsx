'use client'
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import PaymentList from "@/features/PaymentList";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';
import { useIsMobile } from "@/hooks/useIsMobile";


function ExpensePage(){
    const isMobile = useIsMobile();  
    console.log("isMobile", isMobile)

    return( isMobile ? 
        (<>
            <PaymentList />
        </>) : 
        (<>
            <PaymentList />
            <ProjectOverview />
        </>) 
    )
}
export default withAuth(ExpensePage);