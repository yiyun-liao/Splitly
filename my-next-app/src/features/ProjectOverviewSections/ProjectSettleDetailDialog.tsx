import Dialog from "@/components/ui/Dialog";
import Avatar from "@/components/ui/Avatar";
import ModalPortal from "@/components/ui/ModalPortal";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useParams, useRouter } from 'next/navigation';

import { UserData } from "@/types/user";
import { Settlement } from "@/types/calculation";
import { CreatePaymentPayload } from "@/types/payment";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useGroupedByParentCategory } from "@/hooks/usePaymentStats";
import { useCreatePayment } from "../CreatePaymentSections/hooks/useCreatePayment";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";

interface ProjectSettleDetailProps {
    isSelfExpenseOpen: boolean;
    onClose: () => void;
    currentProjectUsers: UserData[];
    settleSimpleDetail:Settlement[];
}

export default function ProjectSettleDetail({
    isSelfExpenseOpen = false,
    onClose,
    currentProjectUsers,
    settleSimpleDetail
}:ProjectSettleDetailProps){
    // 須還款的金額
    const {userData} = useGlobalProjectData()
    const paymentListGroupedByParentCategory = useGroupedByParentCategory()
    
    // 還款紀錄
    const debtList = paymentListGroupedByParentCategory.filter(group => group.parent.id === 101);

    // for create payment
    const { currentProjectData } = useCurrentProjectData();
    const {projectId, userId} = useParams();
    const currentProjectId = typeof projectId === 'string' ? projectId : "";  
    const currentUserId = typeof userId === 'string' ? userId : "";  
    const isMobile = useIsMobile();
    const router = useRouter();


    const { handleCreatePayment, isLoading } = useCreatePayment({
        onSuccess: (payment) => {
            console.log("✅ 成功建立付款：", payment);
            if (isMobile) {
                router.push(`/${userId}/${currentProjectId}/overview`)
            } else {
                router.push(`/${userId}/${currentProjectId}/expense`)
            }
            
            onClose();
        },
        onError: (err) => {
            alert("建立付款失敗，請稍後再試");
            console.log("付款建立錯誤", err);
        },
    });


    const renderBody = () => {
        return(
            <div className="flex flex-col gap-8 text-zinc-700 ">
                <div className="w-full px-3 py-3 box-border h-fit  ">
                    <p className="text-lg pb-4 font-medium truncate min-w-0 max-w-100">尚須還款</p>
                    <div className="w-full bg-sp-green-200 rounded-2xl p-2 flex flex-col gap-2">
                        {settleSimpleDetail.map((settle, index) => {
                            const debtor = currentProjectUsers?.find(user => user.uid === settle?.from);
                            const creditor = currentProjectUsers?.find(user => user.uid === settle?.to);

                            return (
                                <>
                                    <div key={index} className="px-3 py-3 flex items-center justify-start gap-2 rounded-2xl hover:bg-sp-white-40">
                                        <div className="w-full flex items-center justify-start flex-wrap gap-2 overflow-hidden">
                                            <div className="shrink-0 w-50 flex items-center gap-2">
                                                <div  className="shrink-0 flex items-center">
                                                    <Avatar
                                                        size="md"
                                                        img={debtor?.avatarURL}
                                                        userName = {debtor?.name}
                                                    />
                                                </div>
                                                <p className="text-base truncate">{debtor?.name  === userData?.name ? "你" : debtor?.name}</p>
                                            </div>
                                            <div className="flex h-fit items-center gap-2">
                                                <p className="pl-2 text-base font-base truncate text-zinc-500">須還款給</p>
                                                <div className="shrink-0 flex gap-2">
                                                    <div className="shrink-0 flex items-center">
                                                        <Avatar
                                                                size="sm"
                                                                img={creditor?.avatarURL}
                                                                userName = {creditor?.name}
                                                            />
                                                    </div>
                                                    <p className="text-base text-zinc-500">{creditor?.name === userData?.name ? "你" : creditor?.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-fit flex justify-end items-center flex-wrap gap-2">
                                            <p className="shrink-0 text-xl font-semibold">${settle.amount}</p>
                                            <div className="shrink-0">
                                                <Button
                                                    size='sm'
                                                    width='fit'
                                                    variant='outline'
                                                    color='primary'
                                                    disabled={!currentProjectData?.id || !userData || !creditor || !debtor || !currentProjectId || !currentUserId ||isLoading} 
                                                    isLoading={isLoading}
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
                                    {index !== settleSimpleDetail.length - 1 && (
                                        <div className="w-full h-0.25 bg-sp-white-40"></div>
                                    )}
                                </>
                            );
                        })}
                    </div>
                </div>
                <div className="w-full px-3 py-3 box-border h-fit  ">
                    <p className="text-lg pb-4 font-medium truncate min-w-0 max-w-100">還款紀錄</p>
                    <div className="w-full flex flex-col box-border px-3 py-3 h-fit min-h-40 ">
                        {debtList[0].payments.map((payment, index) => {
                            const debtorUid = Object.keys(payment.split_map ?? {})[0];
                            const creditorUid = Object.keys(payment.payer_map ?? {})[0];
                            const debtor = currentProjectUsers?.find(user => user.uid === debtorUid);
                            const creditor = currentProjectUsers?.find(user => user.uid === creditorUid);

                            return (
                                <>
                                    <div key={index} className="px-3 py-3 flex items-end justify-start gap-2">
                                        <div className="w-full overflow-hidden">
                                            <div className="shrink-0 w-full flex items-center gap-2">
                                                <div  className="shrink-0 flex items-center">
                                                    <Avatar
                                                        size="md"
                                                        img={debtor?.avatarURL}
                                                        userName = {debtor?.name}
                                                    />
                                                </div>
                                                <p className="text-base truncate">{debtor?.name  === userData?.name ? "你" : debtor?.name}</p>
                                            </div>
                                            <div className="flex items-center gap-2 w-full">
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
                                        </div>
                                        <p className="w-fit min-w-22 shrink-0 text-xl font-semibold text-end">${payment.amount}</p>
                                    </div>
                                    {index !== settleSimpleDetail.length - 1 && (
                                        <div className="w-full h-0.25 bg-sp-green-200"></div>
                                    )}
                                </>
                            );
                        })}
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
                >
                    {renderBody()}
            </Dialog>
        </ModalPortal>
    )
}