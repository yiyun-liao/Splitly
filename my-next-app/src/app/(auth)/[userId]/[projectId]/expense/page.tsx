'use client'
import { useEffect, useState} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData

import { useAuth } from "@/contexts/AuthContext";
import PaymentList from "@/features/PaymentList";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';
import CreatePayment from "@/features/CreatePaymentSections/CreatePayment-main";
import CreateProject from "@/features/CreateProjectSections/CreateProject-main";
import { useIsMobile } from "@/hooks/useIsMobile";


function ExpensePage(){
    const router = useRouter();
    const {userData} = useAuth()
    const {userId , projectId} =useParams();
    const isMobile = useIsMobile();  
    const searchParams = useSearchParams();
    const shouldOpenCreatePayment = searchParams.get("openCreatePayment") === "true"; //mobile setting 頁面點擊增加收支時會先跳到此頁，再開啟 isCreatePayment
    const shouldOpenCreateProject = searchParams.get("openCreateProject") === "true"; 
    const [isCreatePayment, setIsCreatePayment] = useState(shouldOpenCreatePayment);
    const [isCreateProject, setIsCreateProject] = useState(shouldOpenCreateProject);

    useEffect(()=>{
        setIsCreatePayment(shouldOpenCreatePayment);
        setIsCreateProject(shouldOpenCreateProject);
    },[shouldOpenCreatePayment, shouldOpenCreateProject])

    return( isMobile ? 
        (<>            
            <div>
                {isCreatePayment && (
                    <CreatePayment 
                        open = {true}
                        onClose={() => {
                            setIsCreatePayment(false)
                            router.push(`/${userId}/${projectId}/expense`)
                        }}
                    />
                )}
                {isCreateProject && userData && (
                    <CreateProject
                        open = {true}
                        onClose={() => {
                            setIsCreateProject(false)
                            router.push(`/${userId}/${projectId}/expense`)
                        }}
                        userData = {userData}
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