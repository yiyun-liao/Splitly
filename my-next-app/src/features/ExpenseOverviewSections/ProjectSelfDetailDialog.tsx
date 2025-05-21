import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useState } from "react";

interface ProjectSelfDetailProps {
    isSelfExpenseOpen: boolean;
    onClose: () => void;
    userData: {
        avatar?: string;
        name?: string;
    } | null;
}

export default function ProjectSelfDetail({
    isSelfExpenseOpen = false,
    onClose,
    userData
}:ProjectSelfDetailProps){

    const renderBody = () => {
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
                    <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                        <p className="shrink-0 text-base">欠你</p>
                        <p className="shrink-0 text-xl font-semibold">$489.54805</p>
                    </div>
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
                    <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                        <p className="shrink-0 text-base">借你</p>
                        <p className="shrink-0 text-xl font-semibold">$4803.43</p>
                    </div>
                </div>
            </div>
        )
}
    //console.log('self expense dialog state', isSelfExpenseOpen)
    return(
        <Dialog
                header="您在專案中"
                open={isSelfExpenseOpen} // 從某處打開
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