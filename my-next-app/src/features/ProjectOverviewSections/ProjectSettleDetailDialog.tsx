"use client"; 
import Dialog from "@/components/ui/Dialog";
import Avatar from "@/components/ui/Avatar";
import ModalPortal from "@/components/ui/ModalPortal";
import Button from "@/components/ui/Button/Button";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { useParams, useRouter } from 'next/navigation';
import { useMemo,useState } from "react";
import clsx from "clsx";

import { useAuth } from "@/contexts/AuthContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useGroupedByParentCategory } from "@/hooks/usePaymentStats";
import { useCreatePayment } from "../CreatePaymentSections/hooks/useCreatePayment";
import { useAllSettlements,useMergedSettlements,useSimplifiedSettlements } from "@/hooks/useSettleDebts";
import { formatDate } from "@/utils/formatTime";
import { UserData } from "@/types/user";
import { CreatePaymentPayload } from "@/types/payment";

interface ProjectSettleDetailProps {
    isSelfExpenseOpen: boolean;
    onClose: () => void;
    currentProjectUsers: UserData[];
}

export default function ProjectSettleDetail({
    isSelfExpenseOpen = false,
    onClose,
    currentProjectUsers,
}:ProjectSettleDetailProps){
    // 須還款的金額
    const settleDetail = useAllSettlements();
    const settleSimpleDetail = useMergedSettlements(settleDetail);
    const settleWiseDetail = useSimplifiedSettlements(settleSimpleDetail)
    const {userData} = useAuth();
    
    // for create payment
    const { currentProjectData } = useCurrentProjectData();
    const {projectId, userId} = useParams();
    const currentProjectId = typeof projectId === 'string' ? projectId : "";  
    const currentUserId = typeof userId === 'string' ? userId : "";  
    const isMobile = useIsMobile();
    const router = useRouter();
    
    // 還款紀錄
    const paymentListGroupedByParentCategory = useGroupedByParentCategory()
    const debtList = paymentListGroupedByParentCategory.filter(group => group.parent.id === 101);
    const [showMyRecord, setShowMyRecord] = useState(false); //顯示個人支出
    const displayDebtList = useMemo(()=>{
        if (!showMyRecord) {
            return debtList;
          }
        return debtList.map(group => {
            const filteredPayments = group.payments.filter(p => 
              p.payer_map?.[currentUserId] != null ||
              p.split_map?.[currentUserId] != null
            );
            return { ...group, payments: filteredPayments };
          }).filter(group => group.payments.length > 0);
    },[showMyRecord,debtList,currentUserId])

    // console.log(debtList)

    // update ui
    const visibleSettlements = useMemo(() => {
        return settleSimpleDetail.filter((s) => s.amount > 0);
    }, [settleSimpleDetail]);

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
            console.error("付款建立錯誤", err);
        },
    });


    const renderBody = () => {
        return(
            <div className="flex flex-col gap-8 text-zinc-700 ">
                <div className="w-full box-border h-fit">
                    <div className="pb-4">
                        <p className="text-lg font-medium w-full">尚須還款</p>
                        <p className="text-sm  w-full">使用簡易還款可以更快速地還清債務！</p>
                        <p className="text-sm  w-full">如簡易還款已經沒有欠款，可以忽略這邊的紀錄，避免重複還款</p>
                    </div>
                    <div className="w-full min-h-20 bg-sp-green-200 rounded-2xl flex flex-col gap-2">
                        {settleMiniDetail.length === 0 ? (
                            <p className="shrink-0 flex justify-center items-center my-auto text-xl font-semibold">專案已結清🎉</p>
                        ) : (
                            visibleSettlements.map((settle, index) => {
                                const debtor = currentProjectUsers?.find(user => user.uid === settle?.from);
                                const creditor = currentProjectUsers?.find(user => user.uid === settle?.to);
                                const isLast = index === visibleSettlements.length - 1;

                                return (
                                    <div key={index} className={clsx( "w-full px-3 py-3 flex items-center justify-start gap-2 rounded-2xl hover:bg-sp-white-40", { "border-b border-sp-white-60": !isLast })}>
                                        <div className="w-full flex items-center justify-start flex-col gap-2 overflow-hidden">
                                            <div className="shrink-0 w-full flex items-center gap-2">
                                                <div  className="shrink-0 flex items-center">
                                                    <Avatar
                                                        size="md"
                                                        img={debtor?.avatarURL}
                                                        userName = {debtor?.name}
                                                    />
                                                </div>
                                                <p className="w-full text-base break-all">{debtor?.name  === userData?.name ? "你" : debtor?.name}</p>
                                            </div>
                                            {isMobile ? (
                                                <div className="flex w-full items-start gap-2 overflow-hidden flex-col pl-10">
                                                    <p className="shrink-0 text-base font-base text-zinc-500 ">須還款給</p>
                                                    <div className="shrink-0 flex gap-2 w-full justify-start items-center">
                                                        <div className="shrink-0 flex items-center">
                                                            <Avatar
                                                                    size="sm"
                                                                    img={creditor?.avatarURL}
                                                                    userName = {creditor?.name}
                                                                />
                                                        </div>
                                                        <p className="text-base text-zinc-500 break-all">{creditor?.name === userData?.name ? "你" : creditor?.name}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex w-full items-center gap-2 overflow-hidden">
                                                <p className="shrink-0 pl-10 text-base font-base text-zinc-500">須還款給</p>
                                                <div className="shrink-0 flex gap-2">
                                                    <div className="shrink-0 flex items-center">
                                                        <Avatar
                                                                size="sm"
                                                                img={creditor?.avatarURL}
                                                                userName = {creditor?.name}
                                                            />
                                                    </div>
                                                    <p className="text-base text-zinc-500 ">{creditor?.name === userData?.name ? "你" : creditor?.name}</p>
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
                <div className="w-full box-border h-fit">
                    <div className="flex gap-2 items-center pb-4">
                        <p className="text-lg font-medium w-full">還款紀錄</p>
                        <div
                            className={`shrink-0 px-2 py-2 flex items-center justify-center gap-2 rounded-xl bg-sp-green-100 hover:bg-sp-green-200 active:bg-sp-green-200 cursor-pointer }`}
                            onClick={() => {setShowMyRecord(prev => (!prev))}}
                        >
                            <p className="text-base ml-4 shrink-0">僅顯示個人紀錄</p>
                            <IconButton
                                icon={showMyRecord === true ? "solar:check-square-bold" : "solar:stop-outline" }
                                size="sm"
                                variant="text-button"
                                color="primary"
                                type="button"
                            />
                        </div>
                    </div>
                    <div className="w-full flex flex-col box-border h-fit min-h-40 ">
                        {debtList?.[0].payments && debtList?.[0].payments.length !==0 && (
                            displayDebtList?.[0].payments.map((payment, index) => {
                                const debtorUid = Object.keys(payment.payer_map ?? {})[0];
                                const creditorUid = Object.keys(payment.split_map ?? {})[0];
                                const debtor = currentProjectUsers?.find(user => user.uid === debtorUid);
                                const creditor = currentProjectUsers?.find(user => user.uid === creditorUid);
                                const dateOnly = formatDate(payment.time);
                                const isLast = index === debtList.length - 1;
                                return (
                                    <div key={index} className={clsx( "w-full px-3 py-3 flex items-end justify-start gap-2", { "border-b border-sp-green-200": !isLast })}>
                                        <div className="w-full overflow-hidden">
                                            <div className="shrink-0 w-full flex items-center gap-2">
                                                <div  className="shrink-0 flex items-center">
                                                    <Avatar
                                                        size="md"
                                                        img={debtor?.avatarURL}
                                                        userName = {debtor?.name}
                                                    />
                                                </div>
                                                <p className="w-full text-base break-all">{debtor?.name  === userData?.name ? "你" : debtor?.name}</p>
                                            </div>
                                            {isMobile ? (
                                                <div className="flex items-start w-full pl-10 flex-col justify-start gap-2">
                                                    <p className="shrink-0 w-full text-sm text-zinc-500 pr-2">{dateOnly} 給</p>
                                                    <div className="shrink-0 flex gap-2 h-fit items-center">
                                                        <div className="shrink-0 flex items-center">
                                                            <Avatar
                                                                    size="sm"
                                                                    img={creditor?.avatarURL}
                                                                    userName = {creditor?.name}
                                                                />
                                                        </div>
                                                        <p className="text-base  break-all text-zinc-500 ">{creditor?.name === userData?.name ? "你" : creditor?.name}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center w-full pl-2">
                                                    <p className="shrink-0 text-sm text-zinc-500 pr-2">{dateOnly}</p>
                                                    <div className="w-full min-w-10 flex items-center justify-end -space-x-4.5 text-sp-green-300">
                                                        <div className="w-full flex-1 h-0.5 bg-sp-green-300"></div>
                                                            <Icon 
                                                                icon='solar:alt-arrow-right-outline'
                                                                size='xl'
                                                            />
                                                    </div>
                                                    <div className="shrink-0 max-w-40 flex gap-2 h-fit justify-end items-center">
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
                                        <p className="w-fit min-w-22 shrink-0 text-xl font-semibold text-end">${payment.amount}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        )
}
    return(
        <ModalPortal>
            <Dialog
                    header="還款細節"
                    open={isSelfExpenseOpen} // 從某處打開
                    onClose={ () => {
                        onClose();
                    }} // 點擊哪裡關閉
                    footerClassName= "items-center justify-end"
                    footer= {<div> </div>}
                    closeOnBackdropClick = {true}
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}