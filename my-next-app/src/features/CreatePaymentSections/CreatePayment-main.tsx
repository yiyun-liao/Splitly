import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import IconButton from "@/components/ui/IconButton";
import CreatePaymentSplit from "./CreatePaymentSplit";
import CreatePaymentDebt from "./CreatePaymentDebt";
import { RecordMode, CreatePaymentPayload } from "../../types/payment";
import { useGlobalProjectData } from "@/contexts/GlobalProjectContext";
import { UserData } from "@/types/user";

interface CreatePaymentProps {
    open?: boolean;
    onClose: () => void;
    currentProjectUsers: UserData[]; 
}

const userList = [
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/1.jpg", name: "Alice", uid: "4kjf39480fjlk" },
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/2.jpg", name: "Bob", uid: "92jf20fkk29jf" },
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/3.jpg", name: "Charlie", uid: "fj30fj39d9s0d" },

];

export default function CreatePayment({
    open = true,
    onClose,
    currentProjectUsers
    }:CreatePaymentProps){

    const {userData} = useGlobalProjectData();
    const currentUid = userData.uid;

    // receipt-way
    const [recordMode, setRecordMode] = useState<RecordMode>("split");
    const [payload, setPayload] = useState<CreatePaymentPayload>({
        owner:currentUid,
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
        if (!!payload.amount && !!payload.payer_map && !!payload.payment_name){
            isComplete = true;
        }    
        return { isComplete };
    }, [payload]);  

    const handleSubmitData = () => {
        console.log("帳目", payload?.account_type,"增加內容", payload?.record_mode, "分帳方式", payload?.split_way,"分錢方式", payload?.split_method)
        console.log("final db",payload)
        // onSubmit(payload); // 把資料丟到外層
        
    };

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
                        disabled={!isComplete} 
                        //isLoading={isLoading}
                        onClick={handleSubmitData}
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
                {recordMode === "split" && (
                    <CreatePaymentSplit
                        userList={userList}
                        userData={userData}
                        setPayload = {setPayload}
                    />
                )}
                {recordMode === "debt" && (
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