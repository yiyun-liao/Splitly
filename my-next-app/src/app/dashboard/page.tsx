'use client'

import { withAuth } from "@/utils/withAuth";
import { useRouter } from 'next/navigation';
import { logOutUser } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/useUser";
import Button from "@/components/lib/Button";
import Avatar from "@/components/lib/Avatar";
import Image from 'next/image';
import IconButton from "@/components/lib/IconButton";
import ImageButton from "@/components/lib/ImageButton";
import Nav from "@/features/Nav";

function DashboardPage(){
    const {userData, isLoading} = useUser();

    console.log(userData, isLoading)

    return(
        <div className="flex items-start justify-start bg-sp-blue-100">
            <Nav></Nav>
            <div className="py-6 w-full h-screen flex flex-col items-center justify-start gap-2 ">
                <div id="dashboard-header"  className="flex items-center gap-2 w-full justify-between px-6">
                    <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                        <ImageButton
                            image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/2.JPG"
                            size='md'
                            imageName= "Splitly"
                            >
                        </ImageButton>
                        <p className="text-2xl font-medium text-zinc-700 whitespace-nowrap truncate min-w-0 max-w-100"> Project name </p>
                    </div>
                    <button className="shrink-0 flex items-center justify-start gap-2 px-2 py-1 rounded-xl cursor-pointer bg-sp-yellow-200 text-sp-blue-500 hover:bg-sp-yellow-400 hover:text-sp-blue-600 active:bg-sp-yellow-600 active:text-sp-blue-700">
                        <div className="flex items-center justify-start -space-x-2">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name || ''}
                                className = 'border-2 border-zinc-100'
                            />
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name || ''}
                                className = 'border-2 border-zinc-100'
                            />
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name || ''}
                                className = 'border-2 border-zinc-100'
                            />
                        </div>
                        <p className="text-base font-medium">20</p>
                    </button>
                </div>
                <div>
                    <div>Welcome to the dashboard!</div>
                </div>
            </div>
        </div>
    )
}

export default withAuth(DashboardPage);