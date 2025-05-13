'use client'

import Button from '@/components/Button';
import { logInUser } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    async function handleLogin() {
        await logInUser;
        console.log('Logged In!');
        router.push('/');    
    }

    return (
        <main>
            <div>
                <h1>main page</h1>
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
