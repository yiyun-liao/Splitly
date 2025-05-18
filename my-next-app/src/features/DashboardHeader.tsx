import ImageButton from "@/components/lib/ImageButton"
import Avatar from "@/components/lib/Avatar"
import { useState } from "react";
import ProjectMemberList from "../components/template/ProjectMemberList";

interface DashboardHeaderProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
  }

export default function DashboardHeader({userData}:DashboardHeaderProps){
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)


    return(
        <div id="dashboard-header"  className="flex items-center gap-2 w-full justify-between px-6 py-2">
            <ProjectMemberList 
                isMemberListOpen={isMemberDialogOpen}
                onClose = {() => setIsMemberDialogOpen(false)}   
                userData={userData} 
            />
            <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/projectCover/2.JPG"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton>
                <p className="text-2xl font-medium text-zinc-700 whitespace-nowrap truncate min-w-0 max-w-100"> Project name </p>
            </div>
            <button onClick={() => setIsMemberDialogOpen(true)}  className="shrink-0 flex items-center justify-start gap-2 px-2 py-1 rounded-xl cursor-pointer bg-sp-yellow-200 text-sp-blue-500 hover:bg-sp-yellow-400 hover:text-sp-blue-600 active:bg-sp-yellow-600 active:text-sp-blue-700">
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
    )
}