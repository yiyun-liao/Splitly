'use client'

import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { logInUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const {projectData} = useAuth();

    async function handleLogin() {
        const isLogin = await logInUser();
        console.log('Logged In!');
        if (!!isLogin){
            router.push(`/${projectData[0].id}/dashboard`);    
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
