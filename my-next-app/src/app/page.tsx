'use client'

import Button from '@/components/lib/Button';
import Icon from '@/components/lib/Icon';
import Input from '@/components/lib/Input';
import IconButton from '@/components/lib/IconButton';
import { logInUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const tokenCount: [number, number] = [inputValue.length, 40];

    const errorMessage =
      inputValue.length > 40 ? '最多只能輸入 200 字最多只能輸入 200 字' : '';

    const router = useRouter();
    async function handleLogin() {
        const isLogin = await logInUser();
        console.log('Logged In!');
        if (!!isLogin){
            router.push('/dashboard');    
        }
    }

    const handleClick = () => {
        if (!isLoading) {
            setIsLoading(true);
        }
    };

    // useEffect(() => {
    //     if (isLoading) {
    //         const timer = setTimeout(() => {
    //             setIsLoading(false);
    //         }, 1500);
            
    //         // 清理定時器
    //         return () => clearTimeout(timer);
    //     }
    // }, [isLoading]); // 當 isLoading 改變時觸發副作用

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
                    leftIcon="solar:star-angle-bold"
                    rightIcon="solar:star-angle-bold"
                    isLoading={isLoading}
                    onClick={handleClick} >
                        test
                </Button>
                <Button
                    size="md"
                    width="fit"
                    variant="solid"
                    color="primary"
                    //leftIcon="solar:star-angle-bold"
                    rightIcon="solar:star-angle-bold"
                    onClick={handleLogin} >
                        Log in
                </Button>
                <Input
                    label="備註"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    tokenMaxCount={tokenCount}
                    errorMessage={errorMessage}
                    leftIcon="solar:pen-line-duotone"
                />
            </div>
        </main>
    );
};

export default Page;
