'use client'

import Button from "@/components/Button"
import { withAuth } from "@/utils/withAuth"
import { useRouter } from 'next/navigation';
import { logOutUser } from "@/contexts/AuthContext";


function DashboardPage(){
    const router = useRouter();

    async function handleLogout() {
        await logOutUser();
        console.log('Logged out!');
        router.push('/');    
    }

    return(
        <div>
            <div>Welcome to the dashboard!</div>
            <h1>私人分帳頁面</h1>
            <Button                    
                variant="text-button" 
                width='full'
                onClick={handleLogout} >
                    Log out
            </Button>
        </div>
    )
}

export default withAuth(DashboardPage);