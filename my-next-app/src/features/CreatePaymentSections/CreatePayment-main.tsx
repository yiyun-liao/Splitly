import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import IconButton from "@/components/ui/IconButton";
import CreatePaymentSplit from "./CreatePaymentSplit";
import CreatePaymentDebt from "./CreatePaymentDebt";
import { RecordMode, CreatePaymentPayload, UpdatePaymentData } from "@/types/payment";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { useCurrentProjectData } from "@/contexts/CurrentProjectContext";
import { useCreatePayment } from "./hooks/useCreatePayment";
import { useUpdatePayment } from "./hooks/useUpdatePayment";
import { useDeletePayment } from "./hooks/useDeletePayment";
import { useIsMobile } from "@/hooks/useIsMobile";

interface CreatePaymentProps {
    open?: boolean;
    onClose: () => void;
    initialPayload?: UpdatePaymentData; //for update
}

export default function CreatePayment({
    open = true,
    onClose,
    initialPayload
    }:CreatePaymentProps){
    
    const isMobile = useIsMobile();
    const {userData, projectData} = useGlobalProjectData();
    const {currentProjectUsers} = useCurrentProjectData();
    const currentUid = userData?.uid;
    const rawProjectId = useParams()?.projectId;
    const projectId = typeof rawProjectId === 'string' ? rawProjectId : "";

    // receipt-way
    const [recordMode, setRecordMode] = useState<RecordMode>("split");
    const [payload, setPayload] = useState<CreatePaymentPayload>({
        project_id: projectId,
        owner:currentUid || "",
        payment_name: "",
        account_type: "group",
        currency: "TWD",
        amount: 0,
        time: new Date().toISOString(),
        payer_map: {},
        split_map: {},
    });

    const [updatePayload, setUpdatePayload] = useState<UpdatePaymentData>();
    
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);

    // update  
    useEffect(() => {
        if (initialPayload) {
            setPayload(initialPayload);
            setUpdatePayload(initialPayload);
            if (initialPayload.account_type === 'group' && initialPayload.record_mode === 'debt'){
                setRecordMode('debt')
            }else if (initialPayload.account_type === 'group' && initialPayload.record_mode === 'split'){
                setRecordMode('split')
            }else if (initialPayload.account_type === 'personal'){
                setRecordMode('split')
            }
        }
    }, [initialPayload]);

    // disable button
    const {isComplete } = useMemo(() => {
        let isComplete = false;
        if (initialPayload){
            if (!!updatePayload?.id &&!!updatePayload?.amount && !!updatePayload?.payer_map && !!updatePayload?.payment_name && !!updatePayload?.owner){
                isComplete = true;
            }                
        }
        if (!!payload.amount && !!payload.payer_map && !!payload.payment_name && !!payload.owner){
            isComplete = true;
        }    
        return { isComplete };
    }, [payload, updatePayload, initialPayload]);  

    // submit
    const { handleCreatePayment } = useCreatePayment({
        onSuccess: (payment) => {
            // console.log("✅ 成功建立紀錄：", payment);
            onClose();
        },
        onError: (err) => {
            console.log("紀錄建立錯誤", err);
        },
    });
    const { handleUpdatePayment} = useUpdatePayment({
        onSuccess: (payment) => {
            // console.log("✅ 成功更新紀錄：", payment);
            onClose();
        },
        onError: (err) => {
            console.log("付款更新紀錄", err);
        },
    });
    const { handleDeletePayment } = useDeletePayment({
        onSuccess: (paymentId) => {
            // console.log("✅ 成功刪除紀錄：", paymentId);
            onClose();
        },
        onError: (err) => {
            console.log("紀錄刪除錯誤", err);
        },
    });
      
    // console.log("[final]payment list", JSON.stringify(payload, null, 2));
    // console.log("[final] update payment list", JSON.stringify(updatePayload, null, 2));


    return(
        <Sheet open={open} onClose={onClose}>
            {(onClose) => (
                <div className="w-full h-full overflow-hidden">
                    <div id="receipt-form-header"  className={`shrink-0 w-full px-1 ${!isMobile && "max-w-xl"} flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden`}>
                        <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                        <p className="w-full text-xl font-medium truncate min-w-0"> {initialPayload ? '更新' : '新增'}{recordMode == 'split' ? '支出' : '轉帳'}</p>
                        {initialPayload && updatePayload && (
                            <>
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant= 'text-button'
                                    color='primary'
                                    disabled={!isComplete}
                                    onClick={async()=>{
                                        await handleDeletePayment(initialPayload.project_id, initialPayload.id);
                                    }}
                                    >
                                        刪除
                                </Button>
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant='solid'
                                    color='primary'
                                    disabled={!isComplete}
                                    onClick={async()=>{
                                        await handleUpdatePayment(updatePayload);
                                    }}
                                    >
                                        更新
                                </Button>
                            </>
                        )}
                        {!initialPayload && (
                            <Button
                                size='sm'
                                width='fit'
                                variant='solid'
                                color='primary'
                                disabled={!isComplete}
                                onClick={async()=>{
                                    await handleCreatePayment(payload);
                                }}
                                >
                                    儲存
                            </Button>
                        )}
                    </div>
                    <div id="receipt-way" className={`w-full my-4 flex ${!isMobile && "max-w-xl"} bg-sp-white-20 rounded-xl`}>
                        <Button
                            size='sm'
                            width='full'
                            variant= {recordMode == 'split' ? 'solid' : 'text-button'}
                            color= 'primary'
                            disabled = {!!initialPayload && payload.record_mode === 'debt'}
                            onClick={() => setRecordMode("split")}
                            >
                                支出
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={recordMode == 'debt' ? 'solid' : 'text-button'}
                            color='primary'
                            disabled = {initialPayload && (payload.record_mode === 'split' || initialPayload?.account_type=== 'personal')}
                            onClick={() => setRecordMode("debt")}
                            >
                                轉帳
                        </Button>
                    </div>
                    {recordMode === "split"  && userData && currentProjectUsers&& (
                        <CreatePaymentSplit
                            currentProjectUsers={currentProjectUsers}
                            userData={userData}
                            projectData={projectData}
                            setPayload = {setPayload}
                            initialPayload={initialPayload || undefined} 
                            setUpdatePayload = {setUpdatePayload}
                        />
                    )}
                    {recordMode === "debt"  && userData && currentProjectUsers&& (
                        <CreatePaymentDebt
                            currentProjectUsers={currentProjectUsers}
                            userData={userData}
                            projectData={projectData}
                            setPayload = {setPayload}
                            initialPayload={initialPayload || undefined} 
                            setUpdatePayload = {setUpdatePayload}
                        />
                    )}
                </div>
            )}
        </Sheet>
    )
}