import { useState, useEffect, useMemo } from "react";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import IconButton from "@/components/ui/IconButton";
import CreatePaymentSplit from "./CreatePaymentSplit";
import CreatePaymentDebt from "./CreatePaymentDebt";
import { ReceiptWay, CreatePaymentPayload, CreateItemPayload } from "./types";

interface CreatePaymentProps {
    onClose: () => void;
    open?: boolean;
}

const userList = [
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/1.jpg", name: "Alice", uid: "4kjf39480fjlk" },
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/2.jpg", name: "Bob", uid: "92jf20fkk29jf" },
    { avatar: "https://res.cloudinary.com/ddkkhfzuk/image/upload/avatar/3.jpg", name: "Charlie", uid: "fj30fj39d9s0d" },

];

export default function CreatePayment({
    onClose,
    open = true,
    }:CreatePaymentProps){

    // receipt-way
    const [receiptWay, setReceiptWay] = useState<ReceiptWay>("split");
    const [payload, setPayload] = useState<CreatePaymentPayload>({
        paymentName: "",
        receiptWay: "split",
        splitWay: null,
        splitMethod: null,
        currency: "TWD",
        amount: 0,
        categoryId: null,
        time: new Date().toISOString(),
        desc: null,
        payerMap: {},
        splitMap: {},
    });
    const [itemPayloadList, setItemPayloadList] = useState<CreateItemPayload[]>([]);
    
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
        if (!!payload.amount && !!payload.payerMap && !!payload.paymentName && !!payload.receiptWay && !!payload.splitMap){
            isComplete = true;
        }    
        return { isComplete };
    }, [payload]);  

    const handleSubmitData = () => {
        console.log("增加內容", payload?.receiptWay, "分帳方式", payload?.splitWay,"分錢方式", payload?.splitMethod)
        console.log("final db",payload)
        console.log("final item db", itemPayloadList)
        // onSubmit(payload); // 把資料丟到外層
        
    };

    return(
    <Sheet open={open} onClose={onClose}>
        {(onClose) => (
            <>
                <div id="receipt-form-header"  className="shrink-0 w-full px-1 max-w-xl flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden">
                    <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                    <p className="w-full text-xl font-medium truncate min-w-0"> 新增{receiptWay == 'split' ? '支出' : '轉帳'}</p>
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
                        variant= {receiptWay == 'split' ? 'solid' : 'text-button'}
                        color= 'primary'
                        onClick={() => setReceiptWay("split")}
                        >
                            支出
                    </Button>
                    <Button
                        size='sm'
                        width='full'
                        variant={receiptWay == 'debt' ? 'solid' : 'text-button'}
                        color='primary'
                        onClick={() => setReceiptWay("debt")}
                        >
                            轉帳
                    </Button>
                </div>
                {receiptWay === "split" && (
                    <CreatePaymentSplit
                        userList={userList}
                        setPayload = {setPayload}
                        setItemPayloadList = {setItemPayloadList}
                    />
                )}
                {receiptWay === "debt" && (
                    <CreatePaymentDebt
                        userList={userList}
                        setPayload = {setPayload}
                    />
                )}
            </>
        )}
    </Sheet>
    )
}