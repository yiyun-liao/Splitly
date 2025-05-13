'use client'

import Button from '@/components/lib/Button';
import Icon from '@/components/lib/Icon';
import { logInUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    async function handleLogin() {
        const isLogin = await logInUser();
        console.log('Logged In!');
        if (!!isLogin){
            router.push('/dashboard');    
        }
    }

    return (
        <main>
            <div>
                <h1>main page</h1>
                <Icon icon="solar:user-circle-outline" size="md" className="text-red-500" />
                <Button                    
                    variant="text-button" 
                    width='full'
                    onClick={handleLogin} >
                        Log in
                </Button>
            </div>
        </main>
    );
};

export default Page;
