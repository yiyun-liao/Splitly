'use client'

import Button from '@/components/lib/Button';
import Icon from '@/components/lib/Icon';
import IconButton from '@/components/lib/IconButton';
import { logInUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    async function handleLogin() {
        const isLogin = await logInUser();
        console.log('Logged In!');
        if (!!isLogin){
            router.push('/dashboard');    
        }
    }

    const handleClick = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };

    return (
        <main>
            <div>
                <h1>main page</h1>
                <IconButton
                    icon='solar:star-angle-bold'
                    size="md"
                    variant="solid"
                    color="primary"
                    // disabled={isdisabled}
                    isLoading={isLoading}
                    onClick={handleClick} >
                </IconButton>
                <Button
                    size="md"
                    width="fit"
                    variant="solid"
                    color="primary"
                    leftIcon="i-mdi-check"
                    rightIcon="i-mdi-arrow-right"
                    onClick={handleLogin} >
                        Log in
                </Button>
            </div>
        </main>
    );
};

export default Page;
