'use client'
import { useRouter, useParams } from 'next/navigation';

import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import { useIsMobile } from "@/hooks/useIsMobile";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';


function ExpensePage(){
    const isMobile = useIsMobile();  
    const router = useRouter();
    const { projectId } = useParams();

    console.log("isMobile", isMobile)
    if (!isMobile) router.push(`/${projectId}/dashboard`);

    return( isMobile &&
        (<>
            <ProjectOverview />
        </>) 
    )
}
export default withAuth(ExpensePage);
