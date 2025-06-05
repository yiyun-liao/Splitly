import { useState } from "react";

import ImageButton from "@/components/ui/ImageButton"
import Avatar from "@/components/ui/Avatar"
import Button from "@/components/ui/Button";
import ProjectMemberList from "../ProjectOverviewSections/ProjectMemberListDialog";
import CreatePayment from "../CreatePaymentSections/CreatePayment-main";
import { useAuth } from "@/contexts/AuthContext"; 
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";



export default function MemberHeader(){
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
    const [isCreatePayment, setIsCreatePayment] = useState(false)

    const { userData, projectData } = useAuth();
    const {currentPaymentList, currentProjectData, currentProjectUsers} = useCurrentProjectData();
    console.log("who am i", userData)
    console.log("what project i involved", projectData)
    console.log("what i get currentProjectData",currentProjectData)
    console.log("what i get currentProjectUsers",currentProjectUsers)
    console.log("what i get currentPaymentList", currentPaymentList)
    // if ( myDataLoading || usersLoading) return <p>Loading...</p>;

    if (!userData) {
        console.error("userData is null");
        return <p>無法取得使用者資料</p>; // 或 return null
    }

    
    return(
        <div id="dashboard-header"  className="flex items-center gap-2 w-full box-border justify-between px-6 py-2">
            <div>
                {isCreatePayment && currentProjectUsers && (
                    <CreatePayment 
                        onClose={() => setIsCreatePayment(false)}
                    />
                )}
                {isMemberDialogOpen  && currentProjectUsers && (
                    <ProjectMemberList 
                        isMemberListOpen={isMemberDialogOpen}
                        onClose = {() => setIsMemberDialogOpen(false)}   
                    />
                )}
            </div>
            <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                <ImageButton
                    image={currentProjectData?.imgURL}
                    size='md'
                    imageName= {currentProjectData?.project_name || ""}
                    >
                </ImageButton>
                <p className="text-2xl font-medium text-zinc-700 whitespace-nowrap truncate min-w-0 max-w-100">{currentProjectData?.project_name || ""}</p>
            </div>
            <div className="shrink-0 flex items-center justify-start gap-2">
                <Button
                    size='sm'
                    width='fit'
                    variant='solid'
                    color='primary'
                    leftIcon='solar:clipboard-add-linear'
                    onClick={() => setIsCreatePayment(true)}
                    >
                        新增紀錄
                </Button> 
                <button onClick={() => setIsMemberDialogOpen(true)}  
                    className="shrink-0 flex items-center justify-start gap-2 px-2 py-0.5 rounded-xl cursor-pointer bg-sp-yellow-200 text-sp-blue-500 hover:bg-sp-yellow-400 hover:text-sp-blue-600 active:bg-sp-yellow-600 active:text-sp-blue-700">
                    <div className="flex items-center justify-start -space-x-2">
                        {currentProjectUsers?.slice(0, 3).map((user) => (
                            <Avatar
                            key={user.uid}
                            size="md"
                            img={user.avatarURL}
                            userName={user.name}
                            className="border-2 border-zinc-100"
                            />
                        ))}
                    </div>
                    <p className="text-base font-medium">{currentProjectUsers?.length}</p>
                </button>
            </div>
        </div>
    )
}