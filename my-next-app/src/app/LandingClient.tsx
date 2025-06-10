'use client'

import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { logInUser } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLocalStorageItem } from '@/hooks/useTrackLastVisitedProjectPath';
import ImageButton from '@/components/ui/ImageButton';
import IconButton from '@/components/ui/IconButton';

export function isInAppWebView(): boolean {
    const ua = navigator.userAgent;
    return /Line|FBAN|FBAV|Instagram|Messenger|Twitter|MicroMessenger/i.test(ua);
  }

export default function LandingClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { projectData, isLoadedReady:myDataReady, userData } = useAuth();
    const [isLoginTriggered, setIsLoginTriggered] = useState(false); 


    const handleLogin = async () => {
        if (isInAppWebView()) {
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `https://splitly-steel.vercel.app/?redirect=${currentUrl}`;
            return;
        }

        const isLogin = await logInUser();
        if (isLogin) {
            setIsLoginTriggered(true); 
        }
    };
    
    useEffect(() => {
        if (!isLoginTriggered || !myDataReady || !userData) return;
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
    }, [myDataReady, isLoginTriggered, searchParams, router, projectData, userData]);

    return (
        <>
            <main>
                <div className="flex flex-col items-center justify-center px-4">
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
            <footer className='bg-white text-zinc-700 m-auto flex flex-col items-center'>
                <div className='flex px-20 py-20 min-h-50 w-full max-w-[1400px] justify-between items-start'>
                    <div className="shrink-0">
                        <div className='flex items-center justify-start gap-2 pb-4'>
                            <ImageButton
                                image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.JPG"
                                size='sm'
                                imageName= "Splitly"
                            />
                            <h1 className="text-xl font-medium">Splitly</h1>
                        </div>
                        <p className="text-base">您最佳的分帳工具</p>
                    </div>
                    <div className='shrink-0 flex flex-col justify-start items-end gap-2'>
                        <p className="text-sp-blue-500 font-bold text-sm">聯絡我</p>
                        <p className="text-base ">廖宜昀 LIAO, YI-YUN</p>
                        <div className='flex gap-2'>
                            <Button
                                size='sm'
                                width='fit'
                                variant= 'text-button'
                                color='primary'
                                leftIcon='solar:folder-favourite-bookmark-bold'
                                onClick={() => {}}
                                >
                                Portfolio   
                            </Button> 
                            <Button
                                size='sm'
                                width='fit'
                                variant='text-button'
                                color='primary'
                                leftIcon='solar:card-2-bold'
                                onClick={() => {}}
                                >
                                Resume  
                            </Button>    
                            <IconButton
                                icon= 'logos:github-icon'
                                size='md'
                                variant='text-button'
                                color='primary'
                                type= 'button'
                                onClick={()=>{router.push(`https://github.com/yiyun-liao`)}} 
                            />    
                            <IconButton
                                icon= 'skill-icons:linkedin'
                                size='md'
                                variant='text-button'
                                color='primary'
                                type= 'button'
                                onClick={()=>{router.push(`https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit`)}} 
                            />              
                        </div>  
                    </div>
                </div>
                <div className='w-full flex justify-center items-center h-20 border-t-1 border-zinc-300 '>
                    <p className="">© 2025  All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}
