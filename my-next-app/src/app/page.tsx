'use client'

import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { logInUser } from '@/lib/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {projectData, isReady} = useAuth();
    const [isLoginTriggered, setIsLoginTriggered] = useState(false); 

    const handleLogin = async () => {
        const isLogin = await logInUser();
        if (isLogin) {
            setIsLoginTriggered(true); 
        }
    };

    useEffect(() => {
        if (!isLoginTriggered || !isReady) return;

        const redirectUrl = searchParams.get("redirect");
        if (redirectUrl) {
            router.push(redirectUrl);
        } else if (projectData.length > 0) {
            router.push(`/${projectData[0].id}/dashboard`);
        }
    }, [isReady, isLoginTriggered, searchParams, router, projectData]);

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
};

export default Page;
