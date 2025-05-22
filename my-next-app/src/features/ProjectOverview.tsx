import clsx from "clsx";
import { useParams, useRouter } from 'next/navigation';
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import ReceiptCard from "./PaymentListSections/ReceiptCard";
import ProjectSelfDetail from "@/features/ProjectOverviewSections/ProjectSelfDetailDialog";
import ProjectWiseSpilt from "./ProjectOverviewSections/ProjectWiseSpiltDialog";

interface ProjectOverviewProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
  }

export default function ProjectOverview({userData}:ProjectOverviewProps){
    const [isSelfExpenseDialogOpen, setIsSelfExpenseDialogOpen] = useState(false)
    const [isWiseSpiltDialogOpen, setIsWiseSpiltDialogOpen] = useState(false)


    const router = useRouter();
    const params = useParams();
    const projectId = params.projectId;

    const overviewBubbleClass = clsx("w-full px-3 py-3 rounded-2xl bg-sp-white-40 overflow-hidden hover:bg-sp-blue-200 hover:shadow")
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    
    return(
        <div id="expense-overview" className={`${scrollClass} w-full h-full px-3 hidden md:flex flex-col items-start justify-start gap-6 text-zinc-700`}>
            <ProjectSelfDetail
                isSelfExpenseOpen={isSelfExpenseDialogOpen}
                onClose = {() => setIsSelfExpenseDialogOpen(false)}   
                userData={userData} 
            />
            <ProjectWiseSpilt
                isProjectWiseSpiltOpen={isWiseSpiltDialogOpen}
                onClose = {() => setIsWiseSpiltDialogOpen(false)}   
                userData={userData} 
            />
            <div id="overview-bubble-budget" className="w-full shrink-0 px-3 py-3 rounded-2xl text-center bg-sp-yellow-400  text-sp-blue-500 overflow-hidden">
                <Icon 
                    icon='solar:confounded-square-bold'
                    size='xl'
                    //className="text-red-500"
                />
                <p className="text-xl font-semibold ">專案預算...爆掉了！</p>
            </div>
            <div className="shrink-0 w-full flex flex-col xl:flex-row justify-start gap-3 items-stretch">
                <div className="w-full xl:w-1/2 flex flex-col items-start justify-start gap-3">
                    <div id="overview-bubble-quick-view" className={`${overviewBubbleClass}`}>
                        <div className="px-3 py-3">
                            <p className="text-base">專案期間</p>
                            <p className="text-base font-semibold">05.11.2025 - 06.24.2025</p>
                        </div>
                        <div className="px-3 py-3">
                            <p className="text-base">預算規劃</p>
                            <p className="text-xl font-bold">$10000.00</p>
                        </div>
                    </div>
                    <div id="overview-bubble-expense" className={`${overviewBubbleClass}`}>
                        <div className="px-3 py-3">
                            <p className="text-base">整體支出</p>
                            <p className="text-2xl font-bold">$8000.00</p>
                        </div>
                    </div>
                    <div id="overview-bubble-expense-self" className={`${overviewBubbleClass}`}>
                        <div className="px-3 py-3">
                            <p className="text-base">你的支出</p>
                            <p className="text-2xl font-bold">$4231.00</p>
                        </div>
                    </div>                        
                </div>
                <div className="w-full xl:w-1/2 flex flex-col items-start justify-start gap-3">
                    <div id="overview-bubble-spilt-self" className={`${overviewBubbleClass}`}>
                        <div className="pl-3 pb-3 flex items-center justify-start gap-2">
                            <p className="text-base w-full">你在專案中借出</p>
                            <div className="shrink-0 ">
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant='text-button'
                                    color='primary'
                                    //disabled={isdisabled} 
                                    //isLoading={isLoading}
                                    onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                    >
                                        查看全部
                                </Button>
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
                            <p className="shrink-0 text-xl font-semibold">$359.00</p>
                        </div>
                    </div>
                    <div id="overview-bubble-spilt" className={`${overviewBubbleClass} flex-1`}>
                        <div className="pl-3 pb-3 flex items-center justify-start gap-2">
                            <p className="text-base w-full">分帳</p>
                            <div className="shrink-0 ">
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant='text-button'
                                    color='primary'
                                    //disabled={isdisabled} 
                                    //isLoading={isLoading}
                                    onClick={() => setIsWiseSpiltDialogOpen(true)} 
                                    >
                                        查看全部
                                </Button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center justify-start gap-2">
                            <div id="overview-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-2">
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
                            <div id="overview-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-2">
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
                            <div id="overview-bubble-spilt-token" className="w-full px-3 flex items-center justify-start gap-2">
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
                        </div>
                    </div>
                </div>
            </div>
            {location.pathname === `/${projectId}/expense` &&(
                <div id="overview-bubble-expense-chart" className={`${overviewBubbleClass} h-100 shrink-0 text-center`}>
                    chart
                    <img src="https://res.cloudinary.com/ddkkhfzuk/image/upload/test.JPG" width={480} height={200} alt="圖" />
                </div>
            )}
            {location.pathname === `/${projectId}/dashboard` && (
                <div id="overview-bubble-expense-quick-view" className={`${overviewBubbleClass} shrink-0`}>
                    <div className="pl-3 pb-3 flex items-center justify-start gap-2">
                        <p className="text-base w-full">近五筆收支紀錄</p>
                        <div className="shrink-0 ">
                            <Button
                                size='sm'
                                width='fit'
                                variant='text-button'
                                color='primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                onClick={()=> router.push(`/${projectId}/expense`)} 
                                >
                                    查看全部
                            </Button>
                        </div>
                    </div>
                    <div id="expense-list-frame" className="w-full pb-4 px-3">
                        <ReceiptCard/>
                        <div className="w-full h-0.25 bg-sp-green-200"></div>
                        <ReceiptCard/>
                        <div className="w-full h-0.25 bg-sp-green-200"></div>
                        <ReceiptCard/>
                        <div className="w-full h-0.25 bg-sp-green-200"></div>
                        <ReceiptCard/>
                        <div className="w-full h-0.25 bg-sp-green-200"></div>
                        <ReceiptCard/>
                    </div>
                </div>
            )}
        </div>
    )
}