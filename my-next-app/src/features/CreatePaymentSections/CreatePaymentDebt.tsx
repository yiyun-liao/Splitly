"use client"; 
import clsx from "clsx";
import { useState, useEffect, useMemo} from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import Select from "@/components/ui/Select";
import DebtPayer from "./DebtPayerDialog";
import DebtReceiver from "./DebtReceiverDialog";
import { getNowDatetimeLocal } from "@/utils/time";
import {  CreatePaymentPayload, UpdatePaymentData} from "@/types/payment"
import { sanitizeDecimalInput } from "@/utils/parseAmount";
import { UserData } from "@/types/user";
import { useIsMobile } from "@/hooks/useIsMobile";
import { GetProjectData } from "@/types/project";
import { formatToDatetimeLocal } from "@/utils/formatTime";
import { validateInput } from "@/utils/validate";


interface CreatePaymentDebtProps {
    currentProjectUsers: UserData[];
    userData: UserData;
    projectData: GetProjectData[];
    setPayload : (map: CreatePaymentPayload) => void;
    initialPayload?: UpdatePaymentData;
    setUpdatePayload : (map: UpdatePaymentData) => void;
    setIsValidCreate : (map: boolean) => void ;
}

export default function CreatePaymentDebt({
    currentProjectUsers,
    userData,
    projectData,
    setPayload,
    initialPayload,
    setUpdatePayload,
    setIsValidCreate
    }:CreatePaymentDebtProps){
        const currentUid = userData.uid;
        const rawProjectId = useParams()?.projectId;
        const projectId = typeof rawProjectId === 'string' ? rawProjectId : "";   
        const projectName = projectData.find((project) => project.id === projectId)?.project_name;
        const isMobile = useIsMobile();


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

        // 欠款人
        const selectedDebtPayer = currentProjectUsers.find((user) => user.uid === selectedPayerUid);
        const selectedDebtReceiver = currentProjectUsers.find((user) => user.uid === selectedReceiverUid);

        // 金額輸入限制
        const handleDebtAmountChange = (actualInput: string) => {
            const rawValue = sanitizeDecimalInput(actualInput);
            if (isNaN(rawValue) || rawValue < 0) return; 
            setInputDebtAmountValue(rawValue.toString())

        };
        
        // 輸入測試
        const descAvoidInjectionTest = validateInput(inputDescValue);
        useEffect(()=>{
            const valid = descAvoidInjectionTest === null;
            setIsValidCreate(valid);
        },[descAvoidInjectionTest])

        
        //update
        useEffect(() => {
            if (!initialPayload) return;
            // console.log(initialPayload)
          
            setSelectedCurrencyValue(initialPayload.currency || "TWD");
            setInputTimeValue(formatToDatetimeLocal(initialPayload.time) || getNowDatetimeLocal());
            setInputDescValue(initialPayload.desc || "");
            setInputDebtAmountValue(initialPayload.amount.toString());
          
            // 付款人
            const initialPayerUid = Object.keys(initialPayload.payer_map || {})[0];
            if (initialPayerUid) setSelectedPayerUid(initialPayerUid);
          
            // 收款人
            const initialReceiverUid = Object.keys(initialPayload.split_map || {})[0];
            if (initialReceiverUid) setSelectedReceiverUid(initialReceiverUid);
        }, [initialPayload]);

        const isAmountEmpty = useMemo(() => {
            const amount = parseFloat(inputDebtAmountValue);
            return !inputDebtAmountValue || isNaN(amount) || amount <= 0;
          }, [inputDebtAmountValue]);

        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const labelClass = clsx("w-full font-medium truncate")
        const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
        const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
        const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end")

        // get data
        useEffect(() => {
            if (initialPayload){
                const fullUpdate : UpdatePaymentData = {
                    ...initialPayload, 
                    owner:currentUid,
                    currency: selectCurrencyValue,
                    amount:  parseFloat(inputDebtAmountValue || "0"),
                    time: formatToDatetimeLocal(inputTimeValue),
                    desc: inputDescValue || "",
                    payer_map: payerMap,
                    split_map: splitMap,                    
                };
                setUpdatePayload(fullUpdate);
            } else{
                const fullPayload: CreatePaymentPayload = {
                    project_id:projectId,   
                    owner:currentUid,
                    payment_name: "debt",
                    account_type: "group",  
                    record_mode: 'debt',   
                    currency: selectCurrencyValue,
                    amount:  parseFloat(inputDebtAmountValue || "0"),
                    category_id: "101", //debt 的 cat_id
                    time: formatToDatetimeLocal(inputTimeValue),
                    desc: inputDescValue || "",
                    payer_map: payerMap,
                    split_map: splitMap,
                };
                setPayload(fullPayload);               
            }
        }, [projectId,currentUid,selectCurrencyValue, inputDebtAmountValue, inputTimeValue, inputDescValue,setPayload, payerMap, splitMap, initialPayload, setUpdatePayload]);


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
                <section  className={`w-full h-full pb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                    <div className={`w-full grid grid-cols-3 gap-2 px-1 ${!isMobile && "max-w-xl backdrop-blur-2xl"}`}>
                        <div className={`pb-5 ${formSpan3CLass}`}>
                            <div className="w-full flex items-center justify-start gap-2">
                                <span className="font-medium truncate">專案</span>
                                <span className="font-medium truncate text-sp-blue-500">{projectName}</span>
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
                                            disabled={isAmountEmpty}
                                            onClick={()=> setIsDebtPayerOpen(true)}
                                            >
                                                其他人
                                        </Button>
                                    </div>
                                </div>
                            </div>
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
                                            disabled={isAmountEmpty}
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
                                errorMessage={descAvoidInjectionTest ? descAvoidInjectionTest : undefined}
                            />
                        </div>
                    </div>
                </section>
            </div>
        )
}