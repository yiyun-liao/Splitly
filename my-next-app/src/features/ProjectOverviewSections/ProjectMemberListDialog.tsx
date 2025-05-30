import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useState } from "react";
import { UserData } from "@/types/user";
import { GetProjectData } from "@/types/project";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";


interface ProjectMemberListProps {
    isMemberListOpen: boolean;
    onClose: () => void;
    currentProjectUsers : UserData[];
    currentProjectData:GetProjectData;
}

export default function ProjectMemberList({
    isMemberListOpen = false,
    onClose,
    currentProjectUsers,
    currentProjectData
}:ProjectMemberListProps){


    const {userData} = useGlobalProjectData();
    
    const [step, setStep] = useState<"list" | "add">("list")
    const handleBack = () => {
        setStep('list')
    }

    const renderBody = () => {
        if (step === 'list'){
            return(
                <div>
                    {currentProjectUsers?.map((user) => (
                        <div key={user.uid} className="px-3 py-3 flex items-center justify-start gap-2">
                            <div  className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                <div  className="shrink-0  flex items-center justify-center ">
                                    <Avatar
                                        size="md"
                                        img={user.avatarURL}
                                        userName = {user.name}
                                        //onAvatarClick={() => console.log('Clicked!')}
                                    />
                                </div>
                                <p className="text-base w-fll  truncate">{user.name}</p>
                            </div>
                            {currentProjectData.owner  == user.uid && (
                                <div className="shrink-0 p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">擁有者</div>
                            )}
                        </div>
                    ))}
                </div>
            )
        }
        if (step === 'add'){
            return(
                <div>
                    <p className="text-base w-full">新增成員</p>
                    <p>專案 URL: https://yourproject.com/1/expense</p>
                    {/* QR code  */}
                </div>
            )
        }
    }
    //console.log('dialog state', isMemberListOpen)
    return(
        <Dialog
                header="成員"
                open={isMemberListOpen} // 從某處打開
                onClose={ () => {
                    setStep("list");
                    onClose();
                }} // 點擊哪裡關閉
                //headerClassName= {step === "add" ? undefined : "ml-11"}
                // bodyClassName= string // 看需求
                footerClassName= "items-center justify-end"
                leftIcon={step === "add" ? "solar:arrow-left-line-duotone" : undefined}
                //hideCloseIcon = false
                //closeOnBackdropClick = false
                onLeftIconClick={handleBack}
                footer={
                    step === "list" ? (
                        <>
                            <Button
                                variant="outline"
                                color="primary"
                                width = 'full'
                                onClick={() => alert('建立虛擬成員')}
                            >
                                建立虛擬成員
                            </Button>
                            <Button
                                variant="outline"
                                color="primary"
                                width = 'full'
                                onClick={() => setStep("add")}
                            >
                                新增成員
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="solid"
                            color="primary"
                            width = 'full'
                            onClick={handleBack}
                        >
                            返回成員列表
                        </Button>
                    )
                }
            >
                {renderBody()}
        </Dialog>
    )
}