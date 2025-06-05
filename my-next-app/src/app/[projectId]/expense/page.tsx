'use client'
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import PaymentList from "@/features/PaymentList";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSearchParams } from "next/navigation";
import CreatePayment from "@/features/CreatePaymentSections/CreatePayment-main";
import { useState } from "react";

function ExpensePage(){
    const isMobile = useIsMobile();  
    console.log("isMobile", isMobile)
    const searchParams = useSearchParams();
    const shouldOpenCreate = searchParams.get("openCreate") === "true";
    const [isCreatePayment, setIsCreatePayment] = useState(shouldOpenCreate);

    return( isMobile ? 
        (<>            
            <div>
                {isCreatePayment && (
                    <CreatePayment 
                        open = {true}
                        onClose={() => setIsCreatePayment(false)}
                    />
                )}
            </div>
            <PaymentList />
        </>) : 
        (<>
            <PaymentList />
            <ProjectOverview />
        </>) 
    )
}
export default withAuth(ExpensePage);