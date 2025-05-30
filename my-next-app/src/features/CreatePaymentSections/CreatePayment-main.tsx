import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import IconButton from "@/components/ui/IconButton";
import CreatePaymentSplit from "./CreatePaymentSplit";
import CreatePaymentDebt from "./CreatePaymentDebt";
import { RecordMode, CreatePaymentPayload } from "@/types/payment";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { UserData } from "@/types/user";
import { useCreatePayment } from "./hooks";

interface CreatePaymentProps {
    open?: boolean;
    onClose: () => void;
    currentProjectUsers: UserData[]; 
}

export default function CreatePayment({
    open = true,
    onClose,
    currentProjectUsers
    }:CreatePaymentProps){

    const {userData} = useGlobalProjectData();
    const currentUid = userData?.uid;
    const rawProjectId = useParams()?.projectId;
    const projectId = typeof rawProjectId === 'string' ? rawProjectId : "";

    console.log("where am i",projectId)

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
    
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [open]);

    // disable button
    const {isComplete } = useMemo(() => {
        let isComplete = false;
        if (!!payload.amount && !!payload.payer_map && !!payload.payment_name && !!payload.owner){
            isComplete = true;
        }    
        return { isComplete };
    }, [payload]);  

    const { handleCreatePayment, isLoading } = useCreatePayment({
        onSuccess: (payment) => {
            console.log("✅ 成功建立付款：", payment);
            onClose();
        },
        onError: (err) => {
            alert("建立付款失敗，請稍後再試");
            console.log("付款建立錯誤", err);
        },
    });
      
    return(
        <Sheet open={open} onClose={onClose}>
            {(onClose) => (
                <>
                    <div id="receipt-form-header"  className="shrink-0 w-full px-1 max-w-xl flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden">
                        <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                        <p className="w-full text-xl font-medium truncate min-w-0"> 新增{recordMode == 'split' ? '支出' : '轉帳'}</p>
                        <Button
                            size='sm'
                            width='fit'
                            variant='solid'
                            color='primary'
                            disabled={!isComplete || isLoading} 
                            isLoading={isLoading}
                            onClick={async()=>{
                                console.log("帳目", payload?.account_type,"增加內容", payload?.record_mode, "分帳方式", payload?.split_way,"分錢方式", payload?.split_method)
                                await handleCreatePayment(payload);
                            }}
                            >
                                儲存
                        </Button>
                    </div>
                    <div id="receipt-way" className="w-full my-4 px-1 flex max-w-xl bg-sp-white-20 rounded-xl">
                        <Button
                            size='sm'
                            width='full'
                            variant= {recordMode == 'split' ? 'solid' : 'text-button'}
                            color= 'primary'
                            onClick={() => setRecordMode("split")}
                            >
                                支出
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={recordMode == 'debt' ? 'solid' : 'text-button'}
                            color='primary'
                            onClick={() => setRecordMode("debt")}
                            >
                                轉帳
                        </Button>
                    </div>
                    {recordMode === "split"  && userData && (
                        <CreatePaymentSplit
                            currentProjectUsers={currentProjectUsers}
                            userData={userData}
                            setPayload = {setPayload}
                        />
                    )}
                    {recordMode === "debt"  && userData && (
                        <CreatePaymentDebt
                            currentProjectUsers={currentProjectUsers}
                            userData={userData}
                            setPayload = {setPayload}
                        />
                    )}
                </>
            )}
        </Sheet>
    )
}