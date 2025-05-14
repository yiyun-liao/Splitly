'use client'

import Button from '@/components/lib/Button';

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
                <h1>main page - landing page</h1>
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
