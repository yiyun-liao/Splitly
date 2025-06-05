import { useState } from "react";
import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';
import clsx from "clsx";

import ImageButton from "@/components/ui/ImageButton"
import Avatar from "@/components/ui/Avatar"
import IconButton from "@/components/ui/IconButton";
import ProjectMemberList from "../ProjectOverviewSections/ProjectMemberListDialog";
import ProjectListNavMobile from "./ProjectListNavMobile";
import { useAuth } from "@/contexts/AuthContext"; 
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";



export default function MemberHeaderMobile(){
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
    const [isProjectNavOpen, setIsProjectNavOpen] = useState(false)


    const pathname = usePathname();
    const { projectId } = useParams();
    const { userData } = useAuth();
    const { currentProjectData, currentProjectUsers} = useCurrentProjectData();


    if (!userData) {
        console.error("userData is null");
        return <p>無法取得使用者資料</p>; // 或 return null
    }

    // css
    const isMobileClass = clsx("z-20 fixed top-0 flex items-center gap-2 w-full box-border justify-start px-6 py-2",
        {
            "bg-sp-green-300": pathname === `/${projectId}/expense`,
            "bg-sp-blue-100": pathname !== `/${projectId}/expense`
        }
    )
    
    return(
        <div id="dashboard-header"  className={isMobileClass}>
            <div>
                {isProjectNavOpen && (
                    <ProjectListNavMobile
                        isProjectNavOpen={isProjectNavOpen}
                        onClose = {() => setIsProjectNavOpen(false)}  
                    />
                )}
                {isMemberDialogOpen  && currentProjectUsers && (
                    <ProjectMemberList 
                        isMemberListOpen={isMemberDialogOpen}
                        onClose = {() => setIsMemberDialogOpen(false)}   
                    />
                )}
            </div>
            <div className="shrink-0 flex items-center justify-start gap-2">
                <IconButton
                    icon='solar:reorder-outline'
                    size='sm'
                    variant='text-button'
                    color='zinc'
                    type= 'button'
                    onClick={() => setIsProjectNavOpen(true)} 
                />
            </div>
            <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                <ImageButton
                    image={currentProjectData?.imgURL}
                    size='sm'
                    imageName= {currentProjectData?.project_name || ""}
                />
                <p className="text-xl font-medium text-zinc-700 whitespace-nowrap truncate min-w-0 max-w-100">{currentProjectData?.project_name || ""}</p>
            </div>
            <div className="shrink-0 flex items-center justify-start gap-2"> 
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