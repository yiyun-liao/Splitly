import clsx from "clsx";
import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import ImageButton from "@/components/ui/ImageButton";
import Avatar from "@/components/ui/Avatar";
import IconButton from "@/components/ui/IconButton";
import ModalPortal from "@/components/ui/ModalPortal";

import { UserData } from "@/types/user";
import { GetProjectData } from "@/types/project";
import { getProjectStyle } from "@/utils/renderProjectStyle";

interface ProjectDetailProps {
    isProjectDialogOpen: boolean;
    onClose: () => void;
    userData: UserData;
    currentProjectData:GetProjectData;
    currentProjectUsers:UserData[];
    onEditProject: () => void;
}

export default function ProjectDetail({
    isProjectDialogOpen = false,
    onClose,
    userData,
    currentProjectData,
    currentProjectUsers,
    onEditProject
}:ProjectDetailProps){

    // css
    const titleClass = clsx("text-xl pb-4 font-medium whitespace-nowrap truncate min-w-0 max-w-100")
    const itemClass= clsx("w-full flex gap-1 p-1 items-center rounded-xl hover:text-sp-blue-600 hover:bg-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 ")
    const projectClass = clsx("shrink-0 w-full px-0 py-3 box-border h-fit overflow-hidden ")
    const memberClass = clsx("w-full shrink-0 flex flex-col gap-2 box-border px-3 py-3 rounded-2xl h-fit min-h-40 bg-sp-green-200",)
    const listClass = clsx("flex gap-2 justify-start items-start")
    const labelClass = clsx("shrink-0  w-30 font-medium truncate")
    const listContentClass = clsx("shrink-0 w-full")
    const typeParsed = getProjectStyle(currentProjectData.style)

    const renderBody = () => {
        return(
            <div className="flex flex-col pag-4 text-zinc-700">
                <div className={projectClass}>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center justify-start gap-2 min-w-0 overflow-hidden flex-1">
                            <ImageButton
                                image={currentProjectData?.imgURL}
                                size='sm'
                                imageName= {currentProjectData?.project_name || ""}
                            />
                            <p className="text-xl font-medium whitespace-nowrap truncate min-w-0 max-w-100">{currentProjectData?.project_name || ""}</p>
                        </div>
                        <div>
                            <IconButton
                                icon= "solar:pen-new-square-outline"
                                size='md'
                                variant= 'text-button'
                                color='zinc'
                                type= 'button'
                                onClick={onEditProject}
                            />
                        </div>
                    </div>
                    <div className="py-4 flex flex-col gap-4">
                        <div className={listClass}>
                            <p className={labelClass}>類型</p>
                            <p className={listContentClass}>{typeParsed}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>時間</p>
                            <p className={listContentClass}>{currentProjectData?.start_time ?? "過去某天"} - {currentProjectData?.end_time ?? "至今"}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>預算</p>
                            <p className={`${listContentClass} ${!currentProjectData.budget && ("text-sm text-zinc-500")}`}>{`NT$ ${currentProjectData.budget}` || "(沒有設定預算)"}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>個人預算</p>
                            <p className={`${listContentClass} ${currentProjectData.member_budgets?.[userData.uid] === undefined && ("text-sm text-zinc-500")} `}>  {currentProjectData.member_budgets?.[userData.uid] !== undefined ? `NT$ ${currentProjectData.member_budgets?.[userData.uid]?.toLocaleString()}` : "(沒有設定預算)"}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>幣別</p>
                            <p className={listContentClass}>{currentProjectData.currency}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>Memo</p>
                            <p className={listContentClass}>{currentProjectData.desc}</p>
                        </div>
                        <div className={listClass}>
                            <p className={labelClass}>ID</p>
                            <p className={listContentClass}>{currentProjectData.id}</p>
                        </div>
                    </div>
                </div>
                <div className={projectClass}>
                    <p className={titleClass}>參與成員</p>
                    <div className={memberClass}>
                        {currentProjectUsers?.map(user => {
                            return(
                                <div key={user.uid} className={itemClass}>
                                    <div className="w-full flex items-center justify-start gap-2 overflow-hidden" >
                                        <div className="shrink-0  flex items-center justify-center ">
                                            <Avatar
                                                size='md'
                                                img={user?.avatarURL}
                                                userName={user?.name}
                                            />
                                        </div>
                                        <p className="text-base w-fll  truncate">{user.name}</p>
                                    </div>
                                    {currentProjectData?.owner  == user.uid && (
                                        <div className="shrink-0 p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">擁有者</div>
                                    )}
                                </div>
                            )}
                        )}
                    </div>
                </div>
                <div className={projectClass}>
                    <div className="w-60 flex gap-2">
                        <Button
                            size="sm"
                            variant= "outline"
                            color= "primary"
                            width = 'fit'
                            disabled = {true}
                            onClick={()=>{
                                // 刪除專案
                            }}
                        >
                            離開專案
                        </Button>
                        {currentProjectData?.owner  == userData.uid && (
                            <Button
                                size="sm"
                                variant="solid"
                                color="primary"
                                width = 'fit'
                                disabled = {true}
                                onClick={()=>{
                                    // 刪除專案
                                }}
                            >
                                封存專案
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }
    return(
        <ModalPortal>
            <Dialog
                    header="專案"
                    open={isProjectDialogOpen} // 從某處打開
                    onClose={ () => {
                        onClose();
                    }} // 點擊哪裡關閉
                    footerClassName= "items-center justify-end"
                    closeOnBackdropClick = {true}
                    footer= {<div> </div>}
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}