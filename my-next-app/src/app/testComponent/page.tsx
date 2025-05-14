'use client'

import Button from '@/components/lib/Button';
import Icon from '@/components/lib/Icon';
import Input from '@/components/lib/Input';
import Dialog from '@/components/lib/Dialog';
import IconButton from '@/components/lib/IconButton';
import { logInUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const tokenCount: [number, number] = [inputValue.length, 40];
    const [isDisabled, setIsDisable] = useState(true);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleOpen = () => setDialogOpen(true);
    const handleClose = () => setDialogOpen(false);
    const handleBack = () => {
      console.log('點了左側 icon，可執行返回、導覽等功能');
    };

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
        alert('test')
    };

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 3000);
            
            // 清理定時器
            return () => clearTimeout(timer);
        }
    }, [isLoading]); // 當 isLoading 改變時觸發副作用

    return (
        <main>
            <Dialog
                open={isDialogOpen}
                onClose={handleClose}
                header="這是 Dialog 標題"
                leftIcon="solar:arrow-left-line-duotone"
                onLeftIconClick={handleBack}
                footer={
                <>
                    <Button variant="outline" color="primary" onClick={handleClose}>取消</Button>
                    <Button variant="solid" color="primary" onClick={() => alert('確定！')}>確定</Button>
                </>
                }
            >
                <p className="text-zinc-700">這裡是 Dialog 的內容區塊。</p>
            </Dialog>
            <div>
                <h1>以下都是測試用 Component</h1>
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
                    onClick={handleOpen} >
                        開啟 dialog
                </Button>

                <div className=' flex items-start justify-start gap-2'>
                    <Input
                        label="備註"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        tokenMaxCount={tokenCount}
                        errorMessage={errorMessage}
                        disabled = {isDisabled}
                        leftIcon="solar:pen-line-duotone"
                    />
                    <Button
                        size="sm"
                        width="fit"
                        variant="solid"
                        color="primary"
                        //leftIcon="solar:star-angle-bold"
                        //rightIcon="solar:star-angle-bold"
                        onClick={handleOpen} >
                            水平放，無意義
                    </Button>
                </div>
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
