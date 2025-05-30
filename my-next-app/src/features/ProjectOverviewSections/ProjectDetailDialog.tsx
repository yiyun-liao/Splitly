import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import { UserData } from "@/types/user";
import { GetProjectData } from "@/types/project";

interface ProjectDetailProps {
    isProjectDialogOpen: boolean;
    onClose: () => void;
    userData: UserData;
    currentProjectData:GetProjectData;
    currentProjectUsers:UserData[];
}

export default function ProjectDetail({
    isProjectDialogOpen = false,
    onClose,
    currentProjectData,
}:ProjectDetailProps){

    const renderBody = () => {
        return(
            <div>
                <div className="flex flex-col justify-start items-start gap-4">
                    <div className="w-60">
                        <Button
                            size="sm"
                            variant="solid"
                            color="primary"
                            width = 'fit'
                            onClick={()=>{
                                // 刪除專案
                            }}
                        >
                            刪除專案
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    return(
        <Dialog
                header={`${currentProjectData.project_name || ""} 專案`}
                open={isProjectDialogOpen} // 從某處打開
                onClose={ () => {
                    onClose();
                }} // 點擊哪裡關閉
                //headerClassName= {step === "add" ? undefined : "ml-11"}
                // bodyClassName= string // 看需求
                footerClassName= "items-center justify-end"
                //leftIcon={step === "add" ? "solar:arrow-left-line-duotone" : undefined}
                //hideCloseIcon = false
                //closeOnBackdropClick = false
                //onLeftIconClick={handleBack}
                // footer= React.ReactNode
            >
                {renderBody()}
        </Dialog>
    )
}