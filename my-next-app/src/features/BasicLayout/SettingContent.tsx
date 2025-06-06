import clsx from "clsx";
import { useRouter } from 'next/navigation';

import Button from "@/components/ui/Button";
import ImageButton from "@/components/ui/ImageButton";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { logOutUser } from "@/lib/auth";
import { clearUserCache } from "@/utils/cache";

export default function SettingContent(){
    const router = useRouter();
    const { userData,projectData} = useGlobalProjectData();
    const isMobile = useIsMobile();

    async function handleLogout() {
        const success = await logOutUser();
        if (success){
            clearUserCache();
            console.log('Logged out!');
            router.push('/');    
        }
    }
    
    const labelClass = clsx("w-30 font-medium truncate")
    const titleClass = clsx("text-xl pb-2 font-medium whitespace-nowrap truncate min-w-0 max-w-100")
    const itemClass= clsx("w-full flex gap-2 items-center rounded-xl hover:text-sp-blue-600 hover:bg-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 cursor-pointer")
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const myInfoClass = clsx("shrink-0 box-border h-fit overflow-hidden border-b-1 border-sp-blue-300 ",
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
            <div className={myInfoClass}>
                <p className={titleClass}>個人資訊</p>
                <div className="py-4 flex flex-col gap-4">
                    <div className="flex">
                        <p className={labelClass}>名字</p>
                        <p>{userData?.name}</p>
                    </div>
                    <div className="flex">
                        <p className={labelClass}>信箱</p>
                        <p>{userData?.email}</p>
                    </div>
                    <div className="flex">
                        <p className={labelClass}>ID</p>
                        <p>{userData?.uid}</p>
                    </div>
                </div>
            </div>
            <div className={myInfoClass}>
                <p className={titleClass}>參與的專案</p>
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
                                <p className={`${labelClass}`}>{project.project_name}</p>
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
        </div>
        
    )
}