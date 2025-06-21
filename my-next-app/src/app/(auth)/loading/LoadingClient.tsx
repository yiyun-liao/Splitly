'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import { getLocalStorageItem } from '@/hooks/useTrackLastVisitedProjectPath'
import { LogInScreen } from '@/components/layout/LogInScreen'


export default function LoadingDataPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const {  projectData, isLoadedReady:myDataReady, userData } = useAuth()

    useEffect(() => {
        if (!myDataReady || !userData) return;

        const lastPath = getLocalStorageItem<string>("lastVisitedProjectPath");
        const redirectUrl = searchParams.get("redirect");
        // console.log("我要去哪", redirectUrl , "OR", lastPath)

        if (redirectUrl) {
            router.push(redirectUrl);
            // console.log("i have redirect", redirectUrl)
        }else if (lastPath && Array.isArray(projectData) && projectData.some((proj) => proj.id === lastPath)) {
            router.push(`/${userData?.uid}/${lastPath}/dashboard`);
            // console.log("🧭 redirect to last visited project:", lastPath);
        } else if (projectData?.length && projectData[0]?.id && userData?.uid) {
            router.push(`/${userData?.uid}/${projectData[0].id}/dashboard`);
            localStorage.removeItem("lastVisitedProjectPath");
            // console.log("i have project")
        } else {
            router.push(`/${userData?.uid}/create`);
            localStorage.removeItem("lastVisitedProjectPath");
            // console.log("i have nothing")
        }
    }, [myDataReady, searchParams, router, projectData, userData]);


    return <LogInScreen text="登入載入中…" />
}
