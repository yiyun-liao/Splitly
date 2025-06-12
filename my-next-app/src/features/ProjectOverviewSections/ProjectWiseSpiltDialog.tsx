import { useParams, useRouter } from 'next/navigation';
import { useMemo } from "react";
import clsx from "clsx";

import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Icon from "@/components/ui/Icon";
import ModalPortal from "@/components/ui/ModalPortal";

import { UserData } from "@/types/user";
import { CreatePaymentPayload } from "@/types/payment";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAllSettlements,useMergedSettlements,useSimplifiedSettlements } from "@/hooks/useSettleDebts";
import { useCreatePayment } from "../CreatePaymentSections/hooks/useCreatePayment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

interface ProjectWiseSpiltProps {
    isProjectWiseSpiltOpen: boolean;
    onClose: () => void;
    currentProjectUsers: UserData[];

}

export default function ProjectWiseSpilt({
    isProjectWiseSpiltOpen = false,
    onClose,
    currentProjectUsers
}:ProjectWiseSpiltProps){
    // 須還款的金額
    const settleDetail = useAllSettlements();
    const settleSimpleDetail = useMergedSettlements(settleDetail);
    const settleWiseDetail = useSimplifiedSettlements(settleSimpleDetail);
    const {userData} = useGlobalProjectData();

    // for create payment
    const { currentProjectData } = useCurrentProjectData();
    const {projectId, userId} = useParams();
    const currentProjectId = typeof projectId === 'string' ? projectId : "";  
    const currentUserId = typeof userId === 'string' ? userId : "";  
    const isMobile = useIsMobile();
    const router = useRouter();

    // update ui
    const settleMiniDetail = useMemo(() => {
        return settleWiseDetail.filter((s) => s.amount > 0);
      }, [settleWiseDetail]);
    
    const { handleCreatePayment } = useCreatePayment({
        onSuccess: () => {
            // console.log("✅ 成功建立付款：", payment);
            if (isMobile) {
                router.push(`/${userId}/${currentProjectId}/overview`)
            } else {
                router.push(`/${userId}/${currentProjectId}/expense`)
            }
            
            onClose();
        },
        onError: (err) => {
            console.log("付款建立錯誤", err);
        },
    });


    const renderBody = () => {
        return(
            <div className="flex flex-col text-zinc-700 ">
                <div className="pb-4">
                    <p className="text-base w-full">最快速地還清債務！</p>
                </div>                   
                <div className="w-full flex flex-col box-border h-fit min-h-40 ">
                    {settleMiniDetail.length === 0 ? (
                            <p className="shrink-0 flex justify-start items-start text-xl font-semibold">專案已結清🎉</p>
                        ) : (
                            settleMiniDetail.map((settle, index) => {
                                const debtor = currentProjectUsers?.find(user => user.uid === settle?.from);
                                const creditor = currentProjectUsers?.find(user => user.uid === settle?.to);
                                const isLast = index === settleMiniDetail.length - 1;
                                return (
                                    <div key={index} className={clsx( "w-full px-3 py-3 flex items-end justify-start gap-4 rounded-2xl hover:bg-sp-green-200", { "border-b border-sp-green-200": !isLast })}>
                                        <div className="w-full overflow-hidden">
                                            <div className="shrink-0 w-full flex items-center gap-2">
                                                <div  className="shrink-0 flex items-center">
                                                    <Avatar
                                                        size="md"
                                                        img={debtor?.avatarURL}
                                                        userName = {debtor?.name}
                                                    />
                                                </div>
                                                <p className="w-full text-base truncate">{debtor?.name  === userData?.name ? "你" : debtor?.name}</p>
                                            </div>
                                            {isMobile ? (
                                                <div className="flex items-end justify-start w-full flex-col ">
                                                    <div className="w-full  flex items-center justify-end -space-x-4.5 text-sp-green-300 px-10">
                                                        <div className="w-full flex-1 h-0.5 bg-sp-green-300 "></div>
                                                            <Icon 
                                                                icon='solar:alt-arrow-right-outline'
                                                                size='xl'
                                                            />
                                                        </div>
                                                    <div className="shrink-0 w-full flex gap-2 h-fit justify-end items-center">
                                                        <p className="text-base truncate text-zinc-500 text-end">{creditor?.name === userData?.name ? "你" : creditor?.name}</p>
                                                        <div className="shrink-0 flex items-center">
                                                            <Avatar
                                                                    size="sm"
                                                                    img={creditor?.avatarURL}
                                                                    userName = {creditor?.name}
                                                                />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center w-full pl-10  justify-end">
                                                <div className="w-full max-w-40 min-w-20 flex items-center justify-end -space-x-4.5 text-sp-green-300">
                                                    <div className="w-full flex-1 h-0.5 bg-sp-green-300"></div>
                                                        <Icon 
                                                            icon='solar:alt-arrow-right-outline'
                                                            size='xl'
                                                        />
                                                    </div>
                                                <div className="shrink-0 max-w-60 flex gap-2 h-fit justify-end items-center">
                                                    <p className="text-base truncate text-zinc-500 text-end">{creditor?.name === userData?.name ? "你" : creditor?.name}</p>
                                                    <div className="shrink-0 flex items-center">
                                                        <Avatar
                                                                size="sm"
                                                                img={creditor?.avatarURL}
                                                                userName = {creditor?.name}
                                                            />
                                                    </div>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                        <div className="w-fit min-w-22 flex flex-col justify-end items-end gap-2">
                                            <p className="shrink-0 text-xl font-semibold">${settle.amount}</p>
                                            <div className="shrink-0">
                                                <Button
                                                    size='sm'
                                                    width='fit'
                                                    variant='outline'
                                                    color='primary'
                                                    disabled={!currentProjectData?.id || !userData || !creditor || !debtor || !currentProjectId || !currentUserId} 
                                                    onClick={async()=>{
                                                            if (!currentProjectData?.id || !userData || !creditor || !debtor || !currentProjectId || !currentUserId) return;

                                                            const now = new Date().toISOString();
                                                            const amount = settle.amount;
                                                            const debtorUid = debtor.uid;
                                                            const creditorUid = creditor.uid;
                                                            const payer_map = {[debtorUid]: amount};
                                                            const split_map = {[creditorUid]: { fixed: amount, percent: 0, total: amount}};

                                                            const payload: CreatePaymentPayload = {
                                                                project_id: currentProjectId,
                                                                payment_name: "debt",
                                                                account_type: "group",
                                                                record_mode: "debt",
                                                                owner: currentUserId, // 我是 owner
                                                                currency: "TWD",
                                                                amount: amount,
                                                                category_id: "101", // 債務還款類別
                                                                time: now,
                                                                payer_map,
                                                                split_map
                                                            };

                                                            await handleCreatePayment(payload);
                                                    }}
                                                    >
                                                        還款
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                </div>
            </div>
        )
    }
    return(
        <ModalPortal>
            <Dialog
                    header="簡易還款"
                    open={isProjectWiseSpiltOpen} // 從某處打開
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