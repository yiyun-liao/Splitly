import clsx from "clsx";
import { useRouter } from 'next/navigation';
import { useState } from "react";

import Button from "@/components/ui/Button";
import ImageButton from "@/components/ui/ImageButton";
import IconButton from "@/components/ui/IconButton";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { logOutUser } from "@/lib/auth";
import { clearUserCache } from "@/utils/cache";
import DataSettingDialog from "./DataSettingDialog";

export default function SettingContent(){
    const router = useRouter();
    const { userData,projectData} = useGlobalProjectData();
    const isMobile = useIsMobile();
    const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false)
    
    console.log("open setting", "userData", userData)
    async function handleLogout() {
        const success = await logOutUser();
        if (success){
            clearUserCache();
            console.log('Logged out!');
            router.replace('/');    
        }
    }
    
    const labelClass = clsx("shrink-0 w-30 font-medium truncate")
    const infoClass = clsx("w-full text-wrap break-all")
    const itemClass= clsx("w-full flex gap-2 items-center rounded-xl hover:text-sp-blue-600 hover:bg-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 cursor-pointer")
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const titleClass = clsx("shrink-0 box-border h-fit overflow-hidden border-b-1 border-sp-blue-300 ",
        {
            "w-full px-0 py-3": isMobile === true,
            "w-xl px-3 py-6": isMobile === false,  
        }
    )
    const myProjectClass = clsx("w-full shrink-0 p-4 flex flex-col gap-4 box-border px-3 py-3 rounded-2xl h-fit min-h-40 bg-sp-green-200 overflow-hidden",
        {
            "": isMobile === true,
            "max-h-80": isMobile === false,  
        }
    )
    
    return(
        <div className="flex flex-col pag-4 text-zinc-700">
            <>
                {userData && (
                    <DataSettingDialog
                        isSettingDialogOpen={isSettingDialogOpen}
                        onClose = {() => setIsSettingDialogOpen(false)}   
                        userData={userData} 
                    />
                )}
            </>
            <div className={titleClass}>
                <div className="pb-2 flex items-center justify-between gap-2">
                    <p className="text-xl font-medium truncate">個人資訊</p>
                    <div className="shrink-0">
                        <IconButton
                            icon= "solar:pen-new-square-outline"
                            size='md'
                            variant= 'text-button'
                            color='zinc'
                            type= 'button'
                            onClick={() => {setIsSettingDialogOpen(true)}} 
                        />
                    </div>
                </div>
                <div className="py-4 flex flex-col gap-4">
                    <div className="flex">
                        <p className={labelClass}>名字</p>
                        <p className={infoClass}>{userData?.name}</p>
                    </div>
                    <div className="flex">
                        <p className={labelClass}>信箱</p>
                        <p className={infoClass}>{userData?.email}</p>
                    </div>
                    <div className="flex">
                        <p className={labelClass}>ID</p>
                        <p className={infoClass}>{userData?.uid}</p>
                    </div>
                </div>
            </div>
            <div className={titleClass}>
                <div className="pb-2">
                    <p className="text-xl font-medium truncate">參與的專案</p>
                    <p className="text-zinc-500">如需編輯，請至各專案中設定</p>
                </div>
                <div className={`${myProjectClass} ${scrollClass}`}>
                    {projectData?.map(project => {
                        return(
                            <div 
                                key={project.id} 
                                onClick={() => router.push(`/${userData?.uid}/${project.id}/dashboard`)}
                                className={`${itemClass}`}
                            >
                                <ImageButton
                                    key={project.id}
                                    image={project.imgURL}
                                    size='md'
                                    imageName= {project.project_name}
                                    onClick={() => {}}
                                />
                                <p className={`font-medium ${infoClass}`}>{project.project_name}</p>
                            </div>
                        )}
                    )}
                </div>
            </div>
            <div  className={`flex justify-end items-center shrink-0 box-border h-fit overflow-hidden w-full md:w-xl px-3 py-6`}>
                <Button
                    size='sm'
                    width='fit'
                    variant='outline'
                    color='primary'
                    leftIcon='solar:multiple-forward-left-bold'
                    onClick={handleLogout}
                    >
                        登出
                </Button>
            </div>
            {isMobile && (
                    <div className="shrink-0 w-full pb-5 min-h-20 " />
            )}
        </div>
        
    )
}