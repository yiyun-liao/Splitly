'use client'

import Button from "@/components/lib/Button";
import { withAuth } from "@/utils/withAuth";
import { useRouter } from 'next/navigation';
import { logOutUser } from "@/contexts/AuthContext";
import Avatar from "@/components/lib/Avatar";
import { useUser } from "@/contexts/useUser";
import Image from 'next/image';
import IconButton from "@/components/lib/IconButton";
import ImageButton from "@/components/lib/ImageButton";

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
    const navDivClass = "flex flex-col items-start justify-start pb-2"
    return(
        <div className="flex items-start justify-start">
            <nav className="min-w-18 h-screen py-6 flex flex-col items-center justify-start bg-amber-200">
                <div id="nav-loge" className={navDivClass}>
                    <ImageButton
                        image="https://res.cloudinary.com/ddkkhfzuk/image/upload/logo/logo.jpg"
                        size='md'
                        imageName= "Splitly"
                        >
                    </ImageButton> 
                </div>
                <div id="nav-function" className={`${navDivClass} flex-1`}>
                    <IconButton
                        icon='solar:widget-2-bold'
                        size='md'
                        variant='text-button'
                        color='primary'
                        type= 'button'
                        //onClick={handleClick} 
                        >
                    </IconButton> 
                    <IconButton
                        icon='solar:reorder-bold'
                        size='md'
                        variant='text-button'
                        color='primary'
                        type= 'button'
                        //onClick={handleClick} 
                        >
                    </IconButton> 
                </div>
                <div id="nav-project-list">

                </div>
                <div id="nav-setting" className={`${navDivClass} border-t-1 border-zinc-100`}>
                    <IconButton
                        icon='solar:user-bold'
                        size='md'
                        variant='text-button'
                        color='primary'
                        type= 'button'
                        //onClick={handleClick} 
                        >
                    </IconButton> 
                    <IconButton
                        icon='solar:square-double-alt-arrow-right-outline'
                        size='md'
                        variant='text-button'
                        color='primary'
                        type= 'button'
                        //onClick={handleClick} 
                        >
                    </IconButton> 
                </div>
            </nav>
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