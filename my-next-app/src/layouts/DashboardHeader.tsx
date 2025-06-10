import { useState } from "react";
import ImageButton from "@/components/ui/ImageButton"
import Avatar from "@/components/ui/Avatar"
import Button from "@/components/ui/Button";
import ProjectMemberList from "../features/ProjectOverviewSections/ProjectMemberListDialog";
import CreatePayment from "@/features/CreatePaymentSections/CreatePayment-main";
import { UserData } from "@/types/user";

interface DashboardHeaderProps {
    userData: UserData | null;
  }

export default function DashboardHeader({userData}:DashboardHeaderProps){
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
    const [isCreatePayment, setIsCreatePayment] = useState(false)
    return(
        <div id="dashboard-header"  className="flex box-border items-center gap-2 w-full justify-between px-6 py-2">
            {isCreatePayment && 
                <CreatePayment 
                    onClose={() => setIsCreatePayment(false)}
                />
            }
            <ProjectMemberList 
                isMemberListOpen={isMemberDialogOpen}
                onClose = {() => setIsMemberDialogOpen(false)}   
            />
            <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                <ImageButton
                    image="https://res.cloudinary.com/ddkkhfzuk/image/upload/v1749526499/projectCover/2.jpg"
                    size='md'
                    imageName= "Splitly"
                    >
                </ImageButton>
                <p className="text-2xl font-medium text-zinc-700 whitespace-nowrap truncate min-w-0 max-w-100"> Project name </p>
            </div>
            <div className="shrink-0 flex items-center justify-start gap-2">
                <Button
                    size='sm'
                    width='fit'
                    variant='solid'
                    color='primary'
                    leftIcon='solar:clipboard-add-linear'
                    //disabled={isdisabled} 
                    //isLoading={isLoading}
                    onClick={() => setIsCreatePayment(true)}
                    >
                        新增支出
                </Button> 
                <button onClick={() => setIsMemberDialogOpen(true)}  className="shrink-0 flex items-center justify-start gap-2 px-2 py-0.5 rounded-xl cursor-pointer bg-sp-yellow-200 text-sp-blue-500 hover:bg-sp-yellow-400 hover:text-sp-blue-600 active:bg-sp-yellow-600 active:text-sp-blue-700">
                    <div className="flex items-center justify-start -space-x-2">
                        <Avatar
                            size="md"
                            img={userData?.avatarURL}
                            userName = {userData?.name || ''}
                            className = 'border-2 border-zinc-100'
                        />
                        <Avatar
                            size="md"
                            img={userData?.avatarURL}
                            userName = {userData?.name || ''}
                            className = 'border-2 border-zinc-100'
                        />
                        <Avatar
                            size="md"
                            img={userData?.avatarURL}
                            userName = {userData?.name || ''}
                            className = 'border-2 border-zinc-100'
                        />
                    </div>
                    <p className="text-base font-medium">20</p>
                </button>
            </div>
        </div>
    )
}