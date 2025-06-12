import clsx from "clsx";
import { useState, useEffect, useMemo, useRef} from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import IconButton from "@/components/ui/IconButton";
import Select from "@/components/ui/Select";
import { useCategorySelectOptions } from "@/hooks/useCategory";
import SplitPayer from "./SplitPayerDialog";
import SplitByPerson from "./SplitByPersonDialog";
import SplitByItem from "./SplitByItemDialog";
import { UserData } from "@/types/user";
import { SplitDetail, SplitMap, PayerMap, SplitMethod, SplitWay, CreatePaymentPayload, CreateItemPayload, AccountType, GetPaymentData, UpdatePaymentData} from "@/types/payment";
import { formatPercent, formatNumber, formatNumberForData } from "@/utils/parseNumber";
import { getNowDatetimeLocal } from "@/utils/time";
import { sanitizeDecimalInput } from "@/utils/parseAmount";
import { useIsMobile } from "@/hooks/useIsMobile";
import { GetProjectData } from "@/types/project";
import { formatToDatetimeLocal } from "@/utils/formatTime";



interface CreatePaymentSplitProps {
    currentProjectUsers: UserData[];
    userData: UserData;
    projectData: GetProjectData[];
    setPayload : (map: CreatePaymentPayload) => void;
    initialPayload?: UpdatePaymentData;
    setUpdatePayload : (map: UpdatePaymentData) => void;
}


export default function CreatePaymentSplit({
    currentProjectUsers,
    userData,
    projectData,
    setPayload,
    initialPayload,
    setUpdatePayload
    }:CreatePaymentSplitProps){
        const currentUid = userData.uid;
        const rawProjectId = useParams()?.projectId;
        const projectId = typeof rawProjectId === 'string' ? rawProjectId : "";   
        const projectName = projectData.find((project) => project.id === projectId)?.project_name;
        const isMobile = useIsMobile();

        // receipt-split
        const [selectCurrencyValue, setSelectedCurrencyValue] = useState("TWD");
        const [inputAmountValue, setInputAmountValue] = useState("");
        
        const { options: categoryOptions, selectedValue: selectedCategoryValue, setSelectedValue: setSelectedCategoryValue,} = useCategorySelectOptions();

        const [inputPaymentValue, setInputPaymentValue] = useState("");
        const [inputTimeValue, setInputTimeValue] = useState(getNowDatetimeLocal());
        const [inputDescValue, setInputDescValue] = useState("");

        const [accountType, setAccountType] = useState<AccountType>("group");
        const [splitWay, setSplitWay] = useState<SplitWay>("person");
        const [chooseSplitByPerson, setChooseSplitByPerson] = useState<SplitMethod>("percentage");

        const [isSplitPayerOpen, setIsSplitPayerOpen] = useState(false);
        const [isSplitByPersonOpen, setIsSplitByPersonOpen] = useState(false);
        const [isSplitByItemOpen, setIsSplitByItemOpen] = useState(false);

        //  付款人預設
        const [splitPayerMap, setSplitPayerMap] = useState<PayerMap>(()=>{
            const firstUid = currentProjectUsers.find(user => user.uid === currentUid)?.uid || currentProjectUsers[0]?.uid ;
            return { [firstUid]: 0 } ;
        });

        // 個人帳目付款人設定
        const [personalPayerMap, setPersonalPayerMap] = useState<PayerMap>(() =>{
            return { [currentUid]: 0 }
        })

        // 還款人預設
        const [splitByPersonMap, setSplitByPersonMap] = useState<SplitMap>(() => {
            const total = Number(inputAmountValue) || 0;
            const percentValue = parseFloat(formatNumberForData(1 / currentProjectUsers.length));;
            const average = parseFloat(formatNumberForData(total * percentValue))
            return Object.fromEntries(currentProjectUsers.map(user => [user.uid, {
                fixed: 0,
                percent: percentValue,
                total: average
            }]));
        });

        // 項目的還款人設定
        const [splitByItemMap, setSplitByItemMap] = useState<SplitMap>(() => {
            return Object.fromEntries(currentProjectUsers.map(user => [user.uid, {
                fixed: 0,
                percent: 0,
                total: 0
            }]));
        });
        
        // 項目細節設定
        const [localItemPayloadList, setLocalItemPayloadList] = useState<CreateItemPayload[]>([]);

        // 個人帳目還款人設定
       const [personalSplitMap, setPersonalSplitMap] = useState<SplitMap>(() => {
            return { [currentUid]: { fixed: 0,percent: 0,total: 0}};
        });
        const toggleAccountType = () => {
            setAccountType(prev => (prev === "group" ? "personal" : "group"));
        };


        // update
        const isInitialLoadingRef = useRef(true);
        
        // 初次載入 initialPayload
        useEffect(() => {
            if (!initialPayload) return;
            
            isInitialLoadingRef.current = true;
          
            setSelectedCurrencyValue(initialPayload.currency || "TWD");
            setInputAmountValue(initialPayload.amount.toString());
            setInputPaymentValue(initialPayload.payment_name || "");
            setInputTimeValue(formatToDatetimeLocal(formatToDatetimeLocal(initialPayload.time)));
            setInputDescValue(initialPayload.desc || "");
          
            // 類別
            if (initialPayload.category_id) {
              setSelectedCategoryValue(String(initialPayload.category_id));
            }
          
            // 帳目類型,分帳邏輯
            setAccountType(initialPayload.account_type);
            if (initialPayload.split_way) setSplitWay(initialPayload.split_way);
            if (initialPayload.split_method) setChooseSplitByPerson(initialPayload.split_method);
          
            // 付款人
            if (initialPayload.payer_map) {
              setSplitPayerMap(initialPayload.payer_map);
              setPersonalPayerMap(initialPayload.payer_map); // 個人帳通用
            }
          
            // 分帳人
            if (initialPayload.split_map) {
                if (initialPayload.account_type === "personal") {
                    setPersonalSplitMap(initialPayload.split_map);
                } else if (initialPayload.split_way === "person") {
                    setSplitByPersonMap(initialPayload.split_map);
                } else if (initialPayload.split_way === "item") {
                    setSplitByItemMap(initialPayload.split_map);
                }
            }
          
            // 分帳項目
            if (initialPayload.items) {
              setLocalItemPayloadList(initialPayload.items);
            }
        }, [initialPayload]);
          


        // 價格改變就重設
        const didManuallyChangeAmountRef = useRef(false);

        // 金額輸入限制，onChange handler 內設為 true（代表使用者手動輸入）
        const handleSplitAmountChange = (actualInput: string) => {
            const rawValue = sanitizeDecimalInput(actualInput);
            if (isNaN(rawValue) || rawValue < 0) return; 
            setInputAmountValue(rawValue.toString());
            didManuallyChangeAmountRef.current = true;
        };
        
        useEffect(() => {
            // 第一次因 initialPayload 設定 inputValue ➜ 跳過一次
            if (isInitialLoadingRef.current) {
                isInitialLoadingRef.current = false;
                return;
            }
            if (!didManuallyChangeAmountRef.current) return;

            const amount = parseFloat(inputAmountValue || "0");
            const percent = parseFloat(formatNumberForData(1 / currentProjectUsers.length));
            const total = parseFloat(formatNumberForData(amount * percent))
            const groupMap: SplitMap = Object.fromEntries(
                currentProjectUsers.map(user => [user.uid, {
                    fixed: 0,
                    percent: percent,
                    total: total
                }])
            );


            // person
            if (accountType === "personal") {
                setPersonalPayerMap({ [currentUid]: amount });
                setPersonalSplitMap({ 
                  [currentUid]: { fixed: amount, percent: 0, total: amount } 
                });
            }else{
                setSplitWay('person');
                setChooseSplitByPerson("percentage");
                setSplitByPersonMap(groupMap);
                setSplitPayerMap({[currentUid]: amount });
                setLocalItemPayloadList([]);
            }
            didManuallyChangeAmountRef.current = false;

        }, [inputAmountValue, currentProjectUsers, userData, currentUid, initialPayload, accountType]);


        // tag hint
        const tagDescMap: Record<string, (entry: SplitDetail, allEntries: SplitMap) => string> = {
            percentage: (entry, allEntries) => {
                const uniquePercents = new Set(
                    Object.values(allEntries).map(e => formatNumberForData(e.percent))
                );
                const isEvenSplit = uniquePercents.size === 1;
                return isEvenSplit ? '均分' : formatPercent(entry.percent);
            },
            actual: () => '實際支出',
            adjusted: () => '',
        };
        const getTagDesc = (
            splitWay: 'person' | 'item',
            splitMethod: 'percentage' | 'actual' | 'adjusted',
            entry: SplitDetail,
            allEntries: SplitMap
        ): string => {
            if (splitWay === 'item') return ''; 
            const generator = tagDescMap[splitMethod];
            return generator ? generator(entry, allEntries) : '';
        };

        // get data
        // splitMap 決定輸出哪一種分帳結果
        const recordFinalWay = useMemo(() => {
            return accountType === "personal" ? undefined : "split";
        }, [accountType]);

        const splitFinalWay = useMemo(() => {
            return accountType === "personal" ? undefined : splitWay;
        }, [accountType, splitWay]);

        const splitFinalMethod = useMemo(() => {
            return accountType === "personal" ? undefined : splitWay === "item" ? undefined :  chooseSplitByPerson;
        }, [splitWay, chooseSplitByPerson,accountType]);

        const finalAmount  = useMemo(() => {
            const value = parseFloat(inputAmountValue);
            return isNaN(value) ? 0 : value;
        }, [inputAmountValue]);

        const payerFinalMap = useMemo(() => {
            return accountType === "personal" ? personalPayerMap : splitPayerMap;
        }, [accountType, personalPayerMap, splitPayerMap]);

        const splitFinalMap = useMemo(() => {
            return accountType === "personal" ? personalSplitMap : splitWay === "person" ? splitByPersonMap : splitByItemMap;
        }, [splitWay, splitByPersonMap, splitByItemMap, accountType,personalSplitMap]);

        const itemsFinal = useMemo(() => {
            return splitWay === "item"  ? localItemPayloadList : undefined;
        }, [localItemPayloadList, splitWay]);

        const fullPayload: CreatePaymentPayload = useMemo(() => {
            return {
                project_id:projectId,
                owner:currentUid,
                payment_name: inputPaymentValue,
                account_type:accountType, // "personal" | "group"
                record_mode: recordFinalWay,   // "split" | "debt" 
                split_way: splitFinalWay,   // "item" | "person" 
                split_method: splitFinalMethod,  // "percentage" | "actual" | "adjusted" 
                currency: selectCurrencyValue,
                amount: finalAmount,
                category_id: selectedCategoryValue|| undefined, 
                time: formatToDatetimeLocal(inputTimeValue),
                desc: inputDescValue || undefined,
                payer_map: payerFinalMap,
                split_map: splitFinalMap,
                items:itemsFinal,
            };
          }, [projectId,currentUid,inputPaymentValue,accountType,recordFinalWay,splitFinalWay,splitFinalMethod,selectCurrencyValue,finalAmount,selectedCategoryValue,inputTimeValue,inputDescValue,payerFinalMap,splitFinalMap,itemsFinal]);

        const fullUpdate: UpdatePaymentData = useMemo(() => {
            if (!initialPayload) {
                return {} as UpdatePaymentData; 
            }
            return {
                ...initialPayload,
                owner:currentUid,
                payment_name: inputPaymentValue,
                account_type:accountType, // "personal" | "group"
                record_mode: recordFinalWay,   // "split" | "debt" 
                split_way: splitFinalWay,   // "item" | "person" 
                split_method: splitFinalMethod,  // "percentage" | "actual" | "adjusted" 
                currency: selectCurrencyValue,
                amount: finalAmount,
                category_id: selectedCategoryValue|| undefined, 
                time: formatToDatetimeLocal(inputTimeValue),
                desc: inputDescValue || undefined,
                payer_map: payerFinalMap,
                split_map: splitFinalMap,
                items:itemsFinal,
            };
          }, [initialPayload,currentUid,inputPaymentValue,accountType,recordFinalWay,splitFinalWay,splitFinalMethod,selectCurrencyValue,finalAmount,selectedCategoryValue,inputTimeValue,inputDescValue,payerFinalMap,splitFinalMap,itemsFinal]);
        
        useEffect(() => {
            if (initialPayload){
                setUpdatePayload(fullUpdate)
            }
            setPayload(fullPayload);
        }, [fullPayload, setPayload, initialPayload, setUpdatePayload, fullUpdate]);

        // css
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const labelClass = clsx("w-full font-medium truncate")
        const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
        const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
        const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end")
        const toggleClass = clsx("shrink-0 px-2 py-2 flex items-center justify-center gap-2 rounded-xl bg-sp-white-20",
            {
                "text-zinc-400 cursor-not-allowed": initialPayload,
                "hover:bg-sp-green-100 active:bg-sp-green-200 cursor-pointer": !initialPayload
            }
        )

        return(
            <div className="w-full h-full pb-20 mb-20">
                <div>
                    {isSplitPayerOpen &&
                        <SplitPayer
                            isSplitPayerOpen = {isSplitPayerOpen}
                            onClose={() => setIsSplitPayerOpen(false)}
                            currentProjectUsers={currentProjectUsers}
                            inputAmountValue={inputAmountValue}
                            splitPayerMap={splitPayerMap}
                            setSplitPayerMap={setSplitPayerMap}
                        />
                    }
                    {isSplitByPersonOpen &&
                        <SplitByPerson
                            isSplitByPersonOpen = {isSplitByPersonOpen}
                            onClose={() => setIsSplitByPersonOpen(false)}
                            currentProjectUsers={currentProjectUsers}
                            inputAmountValue={inputAmountValue}
                            chooseSplitByPerson = {chooseSplitByPerson}
                            setChooseSplitByPerson = {setChooseSplitByPerson}
                            splitByPersonMap={splitByPersonMap}
                            setSplitByPersonMap={setSplitByPersonMap}
                            setSplitWay={setSplitWay} //回傳設定用
                        />
                    }
                    {isSplitByItemOpen &&
                        <SplitByItem
                            isSplitByItemOpen = {isSplitByItemOpen}
                            onClose={() => setIsSplitByItemOpen(false)}
                            currentProjectUsers={currentProjectUsers} 
                            inputAmountValue={inputAmountValue}
                            itemPayloadList = {localItemPayloadList} //回傳作為更新使用
                            setSplitByItemMap={setSplitByItemMap}
                            setItemPayloadList={setLocalItemPayloadList}
                            setSplitWay={setSplitWay} //回傳設定用
                        />
                    }
                </div>
                <section className={`w-full px-1 h-full pb-20 mb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                    <div className={`w-full ${!isMobile && "max-w-xl"}`}>
                        <div className='w-full flex gap-2 items-center justify-end'>
                            <div className="w-full flex items-center justify-start gap-2">
                                <span className="font-medium truncate">專案</span>
                                <span className="font-medium truncate text-sp-blue-500">{projectName}</span>
                            </div>
                            <div
                                className={toggleClass}
                                onClick={!initialPayload ? () => toggleAccountType() : undefined}
                            >
                                <p className="text-base ml-4 shrink-0">個人帳目</p>
                                <IconButton
                                    icon={accountType === 'personal' ? "solar:check-square-bold" : "solar:stop-outline" }
                                    size="sm"
                                    variant="text-button"
                                    color="primary"
                                    type="button"
                                    disabled={!!initialPayload}
                                />
                            </div>
                        </div>
                        {accountType === 'personal' && (
                            <div className="w-full grid grid-cols-3 gap-2">
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
                                    value={inputAmountValue}
                                    type="number"
                                    onChange={(e) => {handleSplitAmountChange(e.target.value)}}
                                    flexDirection="row"
                                    width="full"
                                    placeholder="點擊編輯"
                                    step="0.01"
                                    inputMode="decimal"                                          
                                    />
                                </div>
                                <div className={formSpan1CLass}>
                                    <span className={labelClass}>類別</span>
                                    <Select
                                        value={selectedCategoryValue?? ""}
                                        required = {true}
                                        onChange={(e) => setSelectedCategoryValue(e.target.value)}
                                        flexDirection= "row"
                                        width= "full"
                                        options={categoryOptions}
                                    />
                                </div>
                                <div className={formSpan2CLass}>
                                    <span className={labelClass}>名稱</span>
                                    <Input
                                        value={inputPaymentValue}
                                        type="text"
                                        onChange={(e) => setInputPaymentValue(e.target.value)}
                                        flexDirection="row"
                                        width="full"
                                        placeholder="點擊編輯"
                                    />
                                </div>
                                <div className={`pb-5 ${formSpan3CLass}`}>
                                    <div className="w-full flex items-center justify-start gap-2">
                                        <span className={labelClass}>付款人</span>
                                    </div>
                                    <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                <div className="shrink-0 flex items-center justify-center">
                                                    <Avatar
                                                    size="md"
                                                    img={userData?.avatarURL}
                                                    userName={userData?.name}
                                                    />
                                                </div>
                                                <p className="text-base truncate">{userData?.name}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                <p className="shrink-0 text-xl font-lg">${formatNumber(Number(inputAmountValue))}</p>
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
                        )}
                        {accountType === 'group' && (
                            <div className="w-full grid grid-cols-3 gap-2">                                                    
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
                                    <span className="w-full font-sm text-zinc-570 truncate">重設金額就會整個分帳重設</span>
                                    <Input
                                    value={inputAmountValue}
                                    type="number"
                                    onChange={(e) => {handleSplitAmountChange(e.target.value)}}
                                    flexDirection="row"
                                    width="full"
                                    placeholder="點擊編輯"
                                    step="0.01"
                                    inputMode="decimal"                                          
                                    />
                                </div>
                                <div className={formSpan1CLass}>
                                    <span className={labelClass}>類別</span>
                                    <Select
                                        value={selectedCategoryValue??""}
                                        required = {true}
                                        onChange={(e) => setSelectedCategoryValue(e.target.value)}
                                        flexDirection= "row"
                                        width= "full"
                                        options={categoryOptions}
                                    />
                                </div>
                                <div className={formSpan2CLass}>
                                    <span className={labelClass}>名稱</span>
                                    <Input
                                        value={inputPaymentValue}
                                        type="text"
                                        onChange={(e) => setInputPaymentValue(e.target.value)}
                                        flexDirection="row"
                                        width="full"
                                        placeholder="點擊編輯"
                                    />
                                </div>
                                <div className={`pb-5 ${formSpan3CLass}`}>
                                    <div className="w-full flex items-center justify-start gap-2">
                                        <span className={labelClass}>付款人</span>
                                        <Button
                                            size='sm'
                                            width='fit'
                                            variant='text-button'
                                            color='primary'
                                            onClick={() => setIsSplitPayerOpen(true)}
                                            >
                                                多位付款人
                                        </Button>
                                    </div>
                                    <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                        {Object.entries(splitPayerMap).map(([uid, amount]) => {
                                            const user = currentProjectUsers.find(user => user.uid === uid);
                                            if (!user) return null;
                                            return (
                                            <div key={uid} className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                <div className="shrink-0 flex items-center justify-center">
                                                    <Avatar
                                                    size="md"
                                                    img={user.avatarURL}
                                                    userName={user.name}
                                                    />
                                                </div>
                                                <p className="text-base truncate">{user.name}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                <p className="shrink-0 text-xl font-lg">${formatNumber(amount)}</p>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className={`pb-5 ${formSpan3CLass}`}>
                                    <div className="w-full flex items-center justify-start gap-2">
                                        <span className={labelClass}>分帳方式</span>
                                        <div id="receipt-way" className="w-full my-4 flex bg-sp-white-20 rounded-xl">
                                            <Button
                                                size='sm'
                                                width='full'
                                                variant= {splitWay == 'item' ? 'solid' : 'text-button'}
                                                color= 'primary'
                                                onClick={() => {
                                                    setIsSplitByItemOpen(true)
                                                }}
                                                >
                                                    項目分帳
                                            </Button>
                                            <Button
                                                size='sm'
                                                width='full'
                                                variant={splitWay == 'person' ? 'solid' : 'text-button'}
                                                color='primary'
                                                onClick={() => {
                                                    setIsSplitByPersonOpen(true)
                                                }}
                                                >
                                                    成員分帳
                                            </Button>
                                        </div>
                                    </div>
                                    <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                        {currentProjectUsers
                                            .filter(user => {
                                                const map = splitWay === 'item' ? splitByItemMap : splitByPersonMap;
                                                return !!map[user.uid];
                                            })
                                            .map(user => {
                                                const map = splitWay === 'item' ? splitByItemMap : splitByPersonMap;
                                                const entry = map[user.uid];

                                            return(<div key={user.uid} className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                        size="md"
                                                        img={user.avatarURL}
                                                        userName={user.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{user.name}</p>
                                                </div>
                                                <div className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <p className="shrink-0 text-xl font-lg">
                                                        ${formatNumber(entry.total) || '0.00'}
                                                    </p>
                                                    <div className="p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">{getTagDesc(splitWay, chooseSplitByPerson, entry, splitFinalMap)}</div>
                                                </div>
                                            </div>
                                        )})}                                                                                                                            
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
                         )}
                    </div>
                </section>                
            </div>
        )
}