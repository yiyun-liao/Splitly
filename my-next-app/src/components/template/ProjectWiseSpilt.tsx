import Dialog from "@/components/lib/Dialog";
import Button from "@/components/lib/Button";
import Avatar from "@/components/lib/Avatar";
import Icon from "../lib/Icon";
import { useState } from "react";

interface ProjectWiseSpiltProps {
    isProjectWiseSpiltOpen: boolean;
    onClose: () => void;
    userData: {
        avatar?: string;
        name?: string;
    } | null;
}

export default function ProjectWiseSpilt({
    isProjectWiseSpiltOpen = false,
    onClose,
    userData
}:ProjectWiseSpiltProps){

    const renderBody = () => {
        return(
            <div className="w-full flex flex-col items-center justify-start gap-6">
                <div id="overview-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-4">
                    <div className="w-full flex-1 flex items-center justify-start gap-2">
                        <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-xs w-fll  truncate">Yun</p>
                        </div>
                        <div className="w-full text-center flex flex-col items-center justify-start overflow-hidden -space-y-3">
                            <p className="text-sm whitespace-nowrap truncate">須還款</p>
                            <div className="w-full flex items-center justify-start -space-x-4.5 text-sp-blue-500">
                                <div className="w-full flex-1 h-0.5 bg-sp-blue-500"></div>
                                <Icon 
                                    icon='solar:alt-arrow-right-outline'
                                    size='xl'
                                />
                            </div>
                            <p className="text-sm font-semibold">$359.00</p>
                            
                        </div>
                        <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-xs w-fll  truncate">Yun</p>
                        </div>                                       
                    </div>
                    <div className="shrink-0 ">
                        <Button
                            size='sm'
                            width='fit'
                            variant='outline'
                            color='primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                            >
                                已還款
                        </Button>
                    </div>
                </div>
                <div id="overview-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-4">
                    <div className="w-full flex-1 flex items-center justify-start gap-2">
                        <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-xs w-fll  truncate">Yun</p>
                        </div>
                        <div className="w-full text-center flex flex-col items-center justify-start overflow-hidden -space-y-3">
                            <p className="text-sm whitespace-nowrap truncate">須還款</p>
                            <div className="w-full flex items-center justify-start -space-x-4.5 text-sp-blue-500">
                                <div className="w-full flex-1 h-0.5 bg-sp-blue-500"></div>
                                <Icon 
                                    icon='solar:alt-arrow-right-outline'
                                    size='xl'
                                />
                            </div>
                            <p className="text-sm font-semibold">$359.00</p>
                            
                        </div>
                        <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-xs w-fll  truncate">Yun</p>
                        </div>                                       
                    </div>
                    <div className="shrink-0 ">
                        <Button
                            size='sm'
                            width='fit'
                            variant='outline'
                            color='primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                            >
                                已還款
                        </Button>
                    </div>
                </div>
                <div id="overview-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-4">
                    <div className="w-full flex-1 flex items-center justify-start gap-2">
                        <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-xs w-fll  truncate">Yun</p>
                        </div>
                        <div className="w-full text-center flex flex-col items-center justify-start overflow-hidden -space-y-3">
                            <p className="text-sm whitespace-nowrap truncate">須還款</p>
                            <div className="w-full flex items-center justify-start -space-x-4.5 text-sp-blue-500">
                                <div className="w-full flex-1 h-0.5 bg-sp-blue-500"></div>
                                <Icon 
                                    icon='solar:alt-arrow-right-outline'
                                    size='xl'
                                />
                            </div>
                            <p className="text-sm font-semibold">$359.00</p>
                            
                        </div>
                        <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                            <Avatar
                                size="md"
                                img={userData?.avatar}
                                userName = {userData?.name}
                                //onAvatarClick={() => console.log('Clicked!')}
                            />
                            <p className="text-xs w-fll  truncate">Yun</p>
                        </div>                                       
                    </div>
                    <div className="shrink-0 ">
                        <Button
                            size='sm'
                            width='fit'
                            variant='outline'
                            color='primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                            >
                                已還款
                        </Button>
                    </div>
                </div>
            </div>
        )
}
    console.log('wise spilt dialog state', isProjectWiseSpiltOpen)
    return(
        <Dialog
                header="快速分帳"
                open={isProjectWiseSpiltOpen} // 從某處打開
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