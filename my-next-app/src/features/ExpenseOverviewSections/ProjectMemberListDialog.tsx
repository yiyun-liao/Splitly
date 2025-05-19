import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useState } from "react";

interface ProjectMemberListProps {
    isMemberListOpen: boolean;
    onClose: () => void;
    userData: {
        avatar?: string;
        name?: string;
    } | null;
}

export default function ProjectMemberList({
    isMemberListOpen = false,
    onClose,
    userData
}:ProjectMemberListProps){
    const [step, setStep] = useState('list')
    const handleBack = () => {
        setStep('list')
    }

    const renderBody = () => {
        if (step === 'list'){
            return(
                <div>
                    <div className="px-3 py-3 flex items-center justify-start gap-2">
                        <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-base w-fll  truncate">Yun</p>
                        </div>
                        <p className="shrink-0 text-base font-semibold">---</p>
                    </div>
                    <div className="px-3 py-3 flex items-center justify-start gap-2">
                        <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-base w-fll  truncate">Yun</p>
                        </div>
                        <p className="shrink-0 text-base font-semibold">---</p>
                    </div>
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
    console.log('dialog state', isMemberListOpen)
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
                                onClick={() => alert('建立虛擬成員')}
                            >
                                建立虛擬成員
                            </Button>
                            <Button
                                variant="outline"
                                color="primary"
                                onClick={() => setStep("add")}
                            >
                                新增成員
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="solid"
                            color="primary"
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