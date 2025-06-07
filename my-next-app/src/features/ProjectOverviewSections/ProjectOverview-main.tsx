import clsx from "clsx";
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import ProjectSettleDetail from "./ProjectSettleDetailDialog";
import ProjectWiseSpilt from "./ProjectWiseSpiltDialog";
import ProjectDetail from "./ProjectDetailDialog";
import ReceiptCard from "../PaymentListSections/ReceiptCard";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCategoryOptions } from "@/contexts/CategoryContext";
import { getBudgetStatus } from "@/utils/renderBudgetHint";
import { formatNumber } from "@/utils/parseNumber";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useProjectStats, useUserStats } from "@/hooks/usePaymentStats";
import { useAllSettlements,useMergedSettlements } from "@/hooks/useSettleDebts";


export default function ProjectOverview(){
    const [isSelfExpenseDialogOpen, setIsSelfExpenseDialogOpen] = useState(false)
    const [isWiseSpiltDialogOpen, setIsWiseSpiltDialogOpen] = useState(false)
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
    
    const {userData} = useGlobalProjectData();
    const currentUserId = userData?.uid || "";
    const {currentProjectData:data, currentPaymentList:list, currentProjectUsers:userList} = useCurrentProjectData();
    const projectId = data?.id;
    const { categoryOptions } = useCategoryOptions();

    const projectStats = useProjectStats();
    const userStats = useUserStats(currentUserId)
    
    // 判斷顯示支出或是圖表
    const [currentPage, setCurrentPage] = useState("");
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        setCurrentPage(pathname);
    }, [pathname]);

    // ProjectSettleDetail
    const settleDetail = useAllSettlements();
    const settleSimpleDetail = useMergedSettlements(settleDetail);
    const [isSettleReady, setIsSettleReady] = useState(false);
    console.log(settleSimpleDetail);

    const quickViewSettle = useMemo(() => {
        if (!settleSimpleDetail || settleSimpleDetail.length === 0) return null;
        return settleSimpleDetail.find(item => item.from === currentUserId) || settleSimpleDetail[0];
    }, [settleSimpleDetail, currentUserId]);

    const quickViewDebtor = useMemo(() => {
        return userList?.find(user => user.uid === quickViewSettle?.from);
    }, [userList, quickViewSettle]);

    const quickViewCreditor = useMemo(() => {
        return userList?.find(user => user.uid === quickViewSettle?.to);
    }, [userList, quickViewSettle]);

    useEffect(() => {
        if (settleSimpleDetail !== undefined) {
            setIsSettleReady(true);
        }
    }, [settleSimpleDetail]);



    // render data 
    let privateBudget: number | undefined;

    if (userData?.uid) {
      privateBudget = data?.member_budgets?.[userData.uid];
    }
    const projectTotal = projectStats?.grandTotal || 0
    const budgetStatus = getBudgetStatus( projectTotal, data?.budget);

    // css
    const isMobile = useIsMobile();
    
    const overviewBubbleClass = clsx("w-full px-3 py-3 rounded-2xl bg-sp-white-40 overflow-hidden hover:bg-sp-blue-200 hover:shadow")
    const overviewBubbleChildrenClass = clsx("w-full px-3 py-3 rounded-2xl bg-sp-white-40 overflow-hidden hover:bg-sp-blue-200 hover:shadow")
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    const isMobileClass = clsx("w-full box-border flex flex-col xl:flex-row h-full items-start justify-start gap-6 ",
        {
            "px-0": isMobile === true,
        }
    )

    return(
        <div className={`w-full box-border h-full  text-zinc-700 ${scrollClass}`}>
            <>
                {userData && data && (
                    <ProjectDetail
                        isProjectDialogOpen={isProjectDialogOpen}
                        onClose = {() => setIsProjectDialogOpen(false)}   
                        userData={userData} 
                        currentProjectData = {data}
                        currentProjectUsers = {userList || []}
                    />
                )}
                <ProjectSettleDetail
                    isSelfExpenseOpen={isSelfExpenseDialogOpen}
                    settleSimpleDetail = {settleSimpleDetail}
                    currentProjectUsers = {userList || []}
                    onClose = {() => setIsSelfExpenseDialogOpen(false)}   
                />
                <ProjectWiseSpilt
                    isProjectWiseSpiltOpen={isWiseSpiltDialogOpen}
                    onClose = {() => setIsWiseSpiltDialogOpen(false)}   
                    userData={userData} 
                />
            </>
            <div id="expense-overview" className="w-full box-border h-fit flex flex-col items-start justify-start gap-6">
                <div id="overview-bubble-budget" className={`w-full shrink-0 px-3 py-3 rounded-2xl text-center ${budgetStatus.bgColor} ${budgetStatus.textColor} overflow-hidden`}>
                    <Icon icon={budgetStatus.icon} size="xl" />
                    <p className="text-xl font-semibold pt-2">{budgetStatus.text}</p>
                </div>
                <div className={isMobileClass}>
                    <div className="w-full 2xl:w-1/2 h-fit flex flex-col items-start justify-start gap-3">
                        <div id="overview-bubble-quick-view" className={`${overviewBubbleClass}`}>
                            <div className="pl-3 flex items-center justify-start gap-2">
                                <p className="text-base w-full">專案</p>
                                <div className="shrink-0 ">
                                    <Button
                                        size='sm'
                                        width='fit'
                                        variant='text-button'
                                        color='primary'
                                        onClick={()=> setIsProjectDialogOpen(true)}
                                        >
                                            查看專案
                                    </Button>
                                </div>
                            </div>
                            {(!!data?.start_time || !!data?.end_time) && (
                                <div className="px-3 pb-3">
                                    <p className="text-base font-semibold">{data?.start_time ?? "過去某天"} - {data?.end_time ?? "至今"} </p>
                                </div>
                            )}
                            <div className="flex gap-2 flex-wrap justify-start w-full">
                                {(!!data?.budget) && (
                                    <div className="px-3 py-3 w-[calc(50%-0.25rem)] min-w-40">
                                        <p className="text-base">專案預算規劃</p>
                                        <p className="text-2xl  font-semibold">${data.budget}</p>
                                    </div>
                                )}
                                {(!!privateBudget) && (
                                    <div className="py-3 px-3 w-[calc(50%-0.25rem)] min-w-40">
                                        <p className="text-base">個人預算規劃</p>
                                        <p className="text-2xl  font-semibold">${privateBudget}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div id="overview-bubble-expense" className="w-full flex flex-row md:flex-col gap-3">
                            <div className={`${overviewBubbleChildrenClass}`}>
                                <div className="px-3 py-3">
                                    <p className="text-base">整體支出</p>
                                    <p className="text-2xl font-bold">${formatNumber(projectStats?.grandTotal || 0)}</p>
                                </div>
                            </div>
                            <div className={`${overviewBubbleChildrenClass}`}>
                                <div className="px-3 py-3">
                                    <p className="text-base">你的支出</p>
                                    <p className="text-2xl font-bold">${formatNumber(userStats?.grandTotal || 0)}</p>
                                </div>
                            </div>                        
                        </div>
                    </div>
                    <div className="w-full 2xl:w-1/2 h-full flex flex-col items-start justify-start gap-3 ">
                        <div id="overview-bubble-spilt-self" className={`shrink-0 ${overviewBubbleClass}`}>
                            <div className="pl-3 pb-3 flex items-center justify-start gap-2">
                                <p className="text-base w-full">還款細節</p>
                                <div className="shrink-0 ">
                                    <Button
                                        size='sm'
                                        width='fit'
                                        variant='text-button'
                                        color='primary'
                                        //disabled={isdisabled} 
                                        isLoading={!isSettleReady}
                                        onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                        >
                                            查看全部
                                    </Button>
                                </div>
                            </div>
                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                {!quickViewSettle  ? (
                                    <p className="shrink-0 text-xl font-semibold">專案已結清🎉</p>
                                ) : (
                                    <>
                                        <div className="w-full flex  flex-wrap items-center justify-start gap-2 overflow-hidden">
                                            <div className="shrink-0 flex items-center justify-start gap-2">
                                                <div className="shrink-0 flex items-center ">
                                                    <Avatar
                                                        size="md"
                                                        img={quickViewDebtor?.avatarURL}
                                                        userName={quickViewDebtor?.name}
                                                    />
                                                </div>
                                                <p className="text-base truncate">{quickViewDebtor?.name === userData?.name ? "你" : quickViewDebtor?.name}</p>
                                            </div>
                                            <p className="pl-2 text-base font-base text-zinc-500">須還款給 {quickViewCreditor?.name}</p>
                                        </div>
                                        <p className="shrink-0 text-xl font-semibold"> ${quickViewSettle.amount}</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div id="overview-bubble-spilt" className={`flex-1 h-full ${overviewBubbleClass} `}>
                            <div className="pl-3 pb-3 flex items-center justify-start gap-2">
                                <p className="text-base w-full">分帳(這裡還沒做)</p>
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
                                <div className="w-full px-3 flex items-center justify-start gap-2">
                                    <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                        <Avatar
                                            size="md"
                                            img={userData?.avatarURL}
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
                                            img={userData?.avatarURL}
                                            userName = {userData?.name}
                                            //onAvatarClick={() => console.log('Clicked!')}
                                        />
                                        <p className="text-xs w-fll  truncate">Yun</p>
                                    </div>                                       
                                </div>
                                <div className="w-full px-3 flex items-center justify-start gap-2">
                                    <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                        <Avatar
                                            size="md"
                                            img={userData?.avatarURL}
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
                                            img={userData?.avatarURL}
                                            userName = {userData?.name}
                                            //onAvatarClick={() => console.log('Clicked!')}
                                        />
                                        <p className="text-xs w-fll  truncate">Yun</p>
                                    </div>                                       
                                </div>
                                <div className="w-full px-3 flex items-center justify-start gap-2">
                                    <div className="shrink-0 w-12 flex flex-col items-center justify-start gap-0 overflow-hidden">
                                        <Avatar
                                            size="md"
                                            img={userData?.avatarURL}
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
                                            img={userData?.avatarURL}
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
                {isMobile && (
                    <div className="shrink-0 w-full pb-3" />
                )}
                {currentPage === `/${projectId}/expense` &&(
                    <div id="overview-bubble-expense-chart" className={`${overviewBubbleClass} h-100 shrink-0 text-center`}>
                        chart
                        <img src="https://res.cloudinary.com/ddkkhfzuk/image/upload/test.JPG" width={480} height={200} alt="圖" />
                    </div>
                )}
                {currentPage === `/${projectId}/dashboard` && (
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
                                    onClick={()=> router.push(`/${currentUserId}/${projectId}/expense`)} 
                                    >
                                        查看全部
                                </Button>
                            </div>
                        </div>
                        <div id="expense-list-frame" className="w-full pb-4 px-3">
                            {(list || []).slice(0, 5).map((payment, index) => (
                                <div key={payment.id}>
                                    <ReceiptCard
                                        account_type={payment.account_type}
                                        record_mode={payment.record_mode}
                                        payment_name={payment.payment_name}
                                        amount={payment.amount}
                                        payer_map={payment.payer_map}
                                        split_map={payment.split_map}
                                        currentUserId={currentUserId}
                                        userList={userList || []}
                                        categoryId={payment.category_id ?? ""}
                                        categoryList={categoryOptions || []}
                                    />
                                    {index !== 4 && (
                                        <div className="w-full h-0.25 bg-sp-green-200"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}