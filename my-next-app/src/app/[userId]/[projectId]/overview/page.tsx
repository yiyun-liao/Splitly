'use client'
import { useParams, useRouter } from 'next/navigation';

import { withAuth } from "@/hoc/withAuth"; //withAuth 保護頁面 + 傳入 userData
import { useIsMobile } from "@/hooks/useIsMobile";
import ProjectOverview from '@/features/ProjectOverviewSections/ProjectOverview-main';

function OverviewPage(){
    const isMobile = useIsMobile();  
    const router = useRouter();
    const {userId, projectId} = useParams()
    if (!isMobile) router.replace(`/${userId}/${projectId}/dashboard`);

    return( isMobile &&
        (<>
            <ProjectOverview />
        </>) 
    )
}
export default withAuth(OverviewPage);
