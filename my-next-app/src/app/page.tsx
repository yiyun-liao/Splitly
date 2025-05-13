'use client'

import Button from '@/components/lib/Button';
import Icon from '@/components/lib/Icon';
import { logInUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);

    // const router = useRouter();

    // async function handleLogin() {
    //     const isLogin = await logInUser();
    //     console.log('Logged In!');
    //     if (!!isLogin){
    //         router.push('/dashboard');    
    //     }
    // }

    const handleClick = () => {
        setIsLoading(true);                  // 👉 開啟 loading
        setTimeout(() => setIsLoading(false), 1500); // 👉 1.5 秒後自動關掉 loading
      };

    return (
        <main>
            <div>
                <h1>main page</h1>
                <Icon icon="solar:user-circle-outline" size="md" className="text-red-500" />
                <Button
                    size="md"
                    width="fit"
                    variant="solid"
                    color="primary"
                    leftIcon="solar:user-circle-outline"
                    rightIcon="solar:user-circle-outline"
                    isLoading={isLoading}
                    onClick={handleClick} >
                        Log in
                </Button>
            </div>
        </main>
    );
};

export default Page;
