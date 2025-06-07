'use client'

import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { logInUser } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLocalStorageItem } from '@/hooks/useTrackLastVisitedProjectPath';


export default function LandingClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { projectData, isReady, userData } = useAuth();
    const [isLoginTriggered, setIsLoginTriggered] = useState(false); 

    const handleLogin = async () => {
        const isLogin = await logInUser();
        if (isLogin) {
            setIsLoginTriggered(true); 
        }
    };
    
    useEffect(() => {
        if (!isLoginTriggered || !isReady || !userData) return;
        const lastPath = getLocalStorageItem<string>("lastVisitedProjectPath");


        const redirectUrl = searchParams.get("redirect");
        console.log("我要去哪", redirectUrl , "OR", lastPath)

        if (redirectUrl) {
            router.push(redirectUrl);
            console.log("i have redirect", redirectUrl)
        }else if (lastPath) {
            router.push(`/${userData?.uid}/${lastPath}/dashboard`);
            console.log("i have last path", lastPath)
            console.log("🧭 redirect to last visited project:", lastPath);
        } else if (projectData?.length && projectData[0]?.id && userData?.uid) {
            router.push(`/${userData?.uid}/${projectData[0].id}/dashboard`);
            localStorage.removeItem("lastVisitedProjectPath");
            console.log("i have project")
        } else {
            router.push(`/create`);
            localStorage.removeItem("lastVisitedProjectPath");
            console.log("i have nothing")
        }
    }, [isReady, isLoginTriggered, searchParams, router, projectData, userData]);

    return (
        <main>
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <h1>main page - landing page</h1>
                <p>這頁只是還沒做介面，請放心登入</p>
                <Button
                    size="md"
                    width="fit"
                    variant="outline"
                    color="primary"
                    leftIcon="logos:google-icon"
                    onClick={handleLogin} >
                    Log in
                </Button>
            </div>
        </main>
    );
}
