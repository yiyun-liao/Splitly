'use client'
import { useRouter } from 'next/navigation';

import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import { useIsMobile } from "@/hooks/useIsMobile";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';
import { useGlobalProjectData } from '@/contexts/GlobalProjectContext';
import { getLastVisitedProjectId } from "@/utils/cache";



function ExpensePage(){
    const isMobile = useIsMobile();  
    const router = useRouter();
    const { projectData, userData } =useGlobalProjectData();
    const lastPath = getLastVisitedProjectId() || projectData?.[0]?.id;


    if (!isMobile) router.push(`/${userData?.uid}/${lastPath}/dashboard`);

    return( isMobile &&
        (<>
            <ProjectOverview />
        </>) 
    )
}
export default withAuth(ExpensePage);
