'use client'

import Button from "@/components/lib/Button";
import { withAuth } from "@/utils/withAuth";
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
        <div className="flex">
            <div>

            </div>
            <div>
                <div>Welcome to the dashboard!</div>
                <h1>私人分帳頁面</h1>
                <Button
                    size="md"
                    width="fit"
                    variant="solid"
                    color="primary"
                    leftIcon="i-mdi-check"
                    rightIcon="i-mdi-arrow-right"
                    onClick={handleLogout} >
                        Log out
                </Button>
            </div>
        </div>
    )
}

export default withAuth(DashboardPage);