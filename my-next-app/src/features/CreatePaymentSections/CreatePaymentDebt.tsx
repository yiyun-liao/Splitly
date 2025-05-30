import clsx from "clsx";
import { useState, useEffect, useMemo} from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import Select from "@/components/ui/Select";
import DebtPayer from "./DebtPayerDialog";
import DebtReceiver from "./DebtReceiverDialog";
import { getNowDatetimeLocal } from "@/utils/time";
import {  CreatePaymentPayload} from "@/types/payment"
import { sanitizeDecimalInput } from "@/utils/parseAmount";
import { UserData } from "@/types/user";


interface CreatePaymentDebtProps {
    currentProjectUsers: UserData[];
    userData: UserData;
    setPayload : (map: CreatePaymentPayload) => void
}

export default function CreatePaymentDebt({
    currentProjectUsers,
    userData,
    setPayload
    }:CreatePaymentDebtProps){
        const currentUid = userData.uid;

        // receipt-debt
        const [selectCurrencyValue, setSelectedCurrencyValue] = useState("TWD");
        const [inputTimeValue, setInputTimeValue] = useState(getNowDatetimeLocal);
        const [inputDescValue, setInputDescValue] = useState("");
        const [inputDebtAmountValue, setInputDebtAmountValue] = useState("");

        const [isDebtPayerOpen, setIsDebtPayerOpen] = useState(false);
        const [isDebtReceiverOpen, setIsDebtReceiverOpen] = useState(false);


        // 付款人預設
        const [selectedPayerUid, setSelectedPayerUid] = useState(() => {
            return currentProjectUsers.find(user => user.uid === currentUid)?.uid || currentProjectUsers[0]?.uid ;
        });

        const payerMap = useMemo(() => ({
            [selectedPayerUid]: parseFloat(inputDebtAmountValue || "0")
        }), [selectedPayerUid, inputDebtAmountValue]);

            
        // 收款人預設
        const [selectedReceiverUid, setSelectedReceiverUid] = useState(() => {
            return currentProjectUsers.find(user => user.uid !== currentUid)?.uid || currentProjectUsers[0]?.uid;
        });

        const splitMap = useMemo(() => ({
            [selectedReceiverUid]: {
                fixed: parseFloat(inputDebtAmountValue || "0"),
                percent: 0,
                total: parseFloat(inputDebtAmountValue || "0")
            }
        }), [selectedReceiverUid, inputDebtAmountValue]);

        // 假資料
        const selectedDebtPayer = currentProjectUsers.find((user) => user.uid === selectedPayerUid);
        const selectedDebtReceiver = currentProjectUsers.find((user) => user.uid === selectedReceiverUid);

        // 金額輸入限制
        const handleDebtAmountChange = (actualInput: string) => {
            const rawValue = sanitizeDecimalInput(actualInput);
            if (isNaN(rawValue) || rawValue < 0) return; 
            setInputDebtAmountValue(rawValue.toString())

        };
  
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const labelClass = clsx("w-full font-medium truncate")
        const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
        const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
        const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end")

        // get data
        useEffect(() => {
            const payload: CreatePaymentPayload = {    
                owner:currentUid,
                payment_name: "debt",
                account_type: "group",  
                record_mode: 'debt',   
                currency: selectCurrencyValue,
                amount:  parseFloat(inputDebtAmountValue || "0"),
                time: inputTimeValue,
                desc: inputDescValue || "",
                payer_map: payerMap,
                split_map: splitMap,
            };
            setPayload(payload);
        }, [currentUid,selectCurrencyValue, inputDebtAmountValue, inputTimeValue, inputDescValue,setPayload, payerMap, splitMap]);


        return(
            <div className="w-full h-full pb-20 mb-20">
                <div>
                    {isDebtPayerOpen &&
                        <DebtPayer
                            isDebtPayerOpen = {isDebtPayerOpen}
                            onClose={() => setIsDebtPayerOpen(false)}
                            selectedUid={selectedPayerUid}
                            setSelectedUid={setSelectedPayerUid}
                            currentProjectUsers={currentProjectUsers}
                        />
                    }
                    {isDebtReceiverOpen &&
                        <DebtReceiver
                            isDebtReceiverOpen = {isDebtReceiverOpen}
                            onClose={() => setIsDebtReceiverOpen(false)}
                            selectedUid={selectedReceiverUid}
                            setSelectedUid={setSelectedReceiverUid}
                            currentProjectUsers={currentProjectUsers}
                        />
                    }
                </div>
                <section id="receipt-debt"  className={`w-full h-full pb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                    <div id="receipt-form-frame" className="max-w-xl w-full grid grid-cols-3 gap-2 px-1">
                        <div className={`pb-5 ${formSpan3CLass}`}>
                            <div className="w-full flex items-center justify-start gap-2">
                                <span className={labelClass}>匯款人</span>
                            </div>
                            <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                <div className="px-3 py-3 flex items-center justify-start gap-2">
                                    <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div className="shrink-0  flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={selectedDebtPayer?.avatarURL}
                                                userName = {selectedDebtPayer?.name}
                                            />
                                        </div>
                                        <p className="text-base truncate">{selectedDebtPayer?.name}</p>
                                    </div>
                                    <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                        <Button
                                            size='sm'
                                            width='fit'
                                            variant='text-button'
                                            color='zinc'
                                            onClick={()=> setIsDebtPayerOpen(true)}
                                            >
                                                其他人
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={formSpan1CLass}>
                            <span className={labelClass}>費用</span>
                            <Select
                                value={selectCurrencyValue}
                                required={true}
                                placeholder="點擊選擇"
                                onChange={(e) => setSelectedCurrencyValue(e.target.value)}
                                flexDirection="row"
                                width="full"
                                disabled = {true}
                                options={[
                                    { label: "TWD", value: "TWD" , disabled: true}
                                ]}
                            />
                        </div>
                        <div className={formSpan2CLass}>
                            <Input
                            value={inputDebtAmountValue}
                            type="number"
                            onChange={(e)=>{handleDebtAmountChange(e.target.value)}}
                            flexDirection="row"
                            width="full"
                            placeholder="點擊編輯"
                            step="0.01"
                            inputMode="decimal"                                         
                            />
                        </div>
                        <div className={`pb-5 ${formSpan3CLass}`}>
                            <div className="w-full flex items-center justify-start gap-2">
                                <span className={labelClass}>收款人</span>
                            </div>
                            <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                <div className="px-3 py-3 flex items-center justify-start gap-2">
                                    <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div className="shrink-0  flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={selectedDebtReceiver?.avatarURL}
                                                userName = {selectedDebtReceiver?.name}
                                            />
                                        </div>
                                        <p className="text-base truncate">{selectedDebtReceiver?.name}</p>
                                    </div>
                                    <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                        <Button
                                            size='sm'
                                            width='fit'
                                            variant='text-button'
                                            color='zinc'
                                            onClick={()=> setIsDebtReceiverOpen(true)}
                                            >
                                                其他人
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={formSpan3CLass}>
                            <span className={labelClass}>時間</span>
                            <Input
                                value={inputTimeValue}
                                type="datetime-local"
                                onChange={(e) => setInputTimeValue(e.target.value)}
                                flexDirection="row"
                                width="full"
                                placeholder="點擊選擇"
                            />
                        </div>
                        <div className={formSpan3CLass}>
                            <span className={labelClass}>備忘錄</span>
                            <TextArea
                                value={inputDescValue}
                                rows={2}
                                maxRows={4}
                                required={true}
                                onChange={(e) => setInputDescValue(e.target.value)}
                                flexDirection="row"
                                width="full"
                                placeholder="點擊編輯"
                            />
                        </div>
                    </div>
                </section>
            </div>
        )
}