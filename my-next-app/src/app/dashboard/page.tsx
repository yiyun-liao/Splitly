'use client'

import Button from "@/components/lib/Button";
import { withAuth } from "@/utils/withAuth";
import { useRouter } from 'next/navigation';
import { logOutUser } from "@/contexts/AuthContext";
import Avatar from "@/components/lib/Avatar";
import { useUser } from "@/contexts/useUser";

function DashboardPage(){
    const {userData, isLoading} = useUser();

    const router = useRouter();

    async function handleLogout() {
        await logOutUser();
        console.log('Logged out!');
        router.push('/');    
    }
    if (isLoading) return <div>Loading...</div>;

    console.log(userData, isLoading)
    return(
        <div>
            <div>Welcome to the dashboard!</div>
            <Avatar
                size="md"
                img={userData?.avatar}
                userName = {userData?.name || ''}
                onAvatarClick={() => console.log('Clicked!')}
            />
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