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
    const searchParams = useSearchParams();
    const shouldOpenCreate = searchParams.get("openCreate") === "true"; //mobile setting 頁面點擊增加收支時會先跳到此頁，再開啟 isCreatePayment
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