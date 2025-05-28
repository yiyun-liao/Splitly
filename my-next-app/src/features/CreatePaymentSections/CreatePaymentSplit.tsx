import clsx from "clsx";
import { useState, useEffect, useMemo} from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import IconButton from "@/components/ui/IconButton";
import Select from "@/components/ui/Select";
import { fetchCategoriesForSelect } from "@/lib/categoryApi";
import SplitPayer from "./SplitPayerDialog";
import SplitByPerson from "./SplitByPersonDialog";
import SplitByItem from "./SplitByItemDialog";
import { SplitDetail, SplitMap, PayerMap, User, SplitMethod, SplitWay, CreatePaymentPayload, CreateItemPayload, AccountType} from "./types";
import { formatPercent, formatNumber, formatNumberForData } from "./utils";
import { getNowDatetimeLocal } from "@/utils/time";
import { sanitizeDecimalInput } from "@/utils/parseAmount";
import { UserData } from "@/types/user";

interface CreatePaymentSplitProps {
    userList: User[];
    userData: UserData;
    setPayload : (map: CreatePaymentPayload) => void;
    setItemPayloadList : (map: CreateItemPayload[]) => void;
}


export default function CreatePaymentSplit({
    userList,
    userData,
    setPayload,
    setItemPayloadList
    }:CreatePaymentSplitProps){

        // receipt-split
        const [selectCurrencyValue, setSelectedCurrencyValue] = useState("TWD");
        const [inputAmountValue, setInputAmountValue] = useState("");
        
        const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string; disabled: boolean }[]>([]); //渲染
        const [selectCategoryValue, setSelectedCategoryValue] = useState(""); //選取

        const [inputPaymentValue, setInputPaymentValue] = useState("");
        const [inputTimeValue, setInputTimeValue] = useState(getNowDatetimeLocal());
        const [inputDescValue, setInputDescValue] = useState("");

        const [accountType, setAccountType] = useState<AccountType>("group")
        const [splitWay, setSplitWay] = useState<SplitWay>("person");
        const [chooseSplitByPerson, setChooseSplitByPerson] = useState<SplitMethod>("percentage");

        const [isSplitPayerOpen, setIsSplitPayerOpen] = useState(false);
        const [isSplitByPersonOpen, setIsSplitByPersonOpen] = useState(false);
        const [isSplitByItemOpen, setIsSplitByItemOpen] = useState(false);

        //  付款人預設
        const [splitPayerMap, setSplitPayerMap] = useState<PayerMap>(()=>{
            const firstUid = userList[0]?.uid;
            return firstUid ? { [firstUid]: 0 } : {};
        });

        // 個人帳目付款人設定
        const [personalPayerMap, setPersonalPayerMap] = useState<PayerMap>(() =>{
            return { [userData?.uid]: 0 }
        })

        // 還款人預設
        const [splitByPersonMap, setSplitByPersonMap] = useState<SplitMap>(() => {
            const total = Number(inputAmountValue) || 0;
            const percentValue = parseFloat(formatNumberForData(1 / userList.length));;
            const average = parseFloat(formatNumberForData(total * percentValue))
            return Object.fromEntries(userList.map(user => [user.uid, {
                fixed: 0,
                percent: percentValue,
                total: average
            }]));
        });

        // 項目的還款人設定
        const [splitByItemMap, setSplitByItemMap] = useState<SplitMap>(() => {
            return Object.fromEntries(userList.map(user => [user.uid, {
                fixed: 0,
                percent: 0,
                total: 0
            }]));
        });

       // 個人帳目還款人設定
       const [personalSplitMap, setPersonalSplitMap] = useState<SplitMap>(() => {
            return { [userData?.uid]: { fixed: 0,percent: 0,total: 0}};
        });

        // 項目細節設定
        const [localItemPayloadList, setLocalItemPayloadList] = useState<CreateItemPayload[]>([]);

        // 價格改變就重設 
        useEffect(() => {
            const amount = parseFloat(inputAmountValue || "0");
            const percent = parseFloat(formatNumberForData(1 / userList.length));
            const total = parseFloat(formatNumberForData(amount * percent))
            const groupMap: SplitMap = Object.fromEntries(
                userList.map(user => [user.uid, {
                    fixed: 0,
                    percent: percent,
                    total: total
                }])
            );
            const personalMap: SplitMap = { [userData?.uid]: { fixed: amount, percent: 0, total: amount}}

            setChooseSplitByPerson("percentage");
            setSplitByPersonMap(groupMap);
            setSplitPayerMap({["4kjf39480fjlk"]: amount });
            // person
            setPersonalPayerMap({[userData?.uid]: amount })
            setPersonalSplitMap(personalMap);

        }, [inputAmountValue, userList, userData]);


        // 金額輸入限制
        const handleSplitAmountChange = (actualInput: string) => {
            const rawValue = sanitizeDecimalInput(actualInput);
            if (isNaN(rawValue) || rawValue < 0) return; 
            setInputAmountValue(rawValue.toString());
        };
          
        // render category
        useEffect(() => {
            fetchCategoriesForSelect().then((options) => {
              setCategoryOptions(options);
          
              const firstEnabled = options.find(opt => !opt.disabled);
              if (firstEnabled) {
                setSelectedCategoryValue(firstEnabled.value);
              }
            });
        }, [])

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
            return accountType === "personal" ? "personal" : "split";
        }, [accountType]);

        const splitFinalWay = useMemo(() => {
            return accountType === "personal" ? null : splitWay;
        }, [accountType, splitWay]);

        const splitFinalMethod = useMemo(() => {
            return accountType === "personal" ? null : splitWay === "item" ? "item" :  chooseSplitByPerson;
        }, [splitWay, chooseSplitByPerson,accountType]);

        const payerFinalMap = useMemo(() => {
            return accountType === "personal" ? personalPayerMap : splitPayerMap;
        }, [accountType, personalPayerMap, splitPayerMap]);

        const splitFinalMap = useMemo(() => {
            return accountType === "personal" ? personalSplitMap : splitWay === "person" ? splitByPersonMap : splitByItemMap;
        }, [splitWay, splitByPersonMap, splitByItemMap, accountType,personalSplitMap]);

        const payload: CreatePaymentPayload = useMemo(() => {
            return {
                paymentName: inputPaymentValue,
                accountType:accountType, // "personal" | "group"
                recordMode: recordFinalWay,   // "split" | "debt" | "personal"
                splitWay: splitFinalWay,   // "item" | "person" | "personal"
                splitMethod: splitFinalMethod,  // "percentage" | "actual" | "adjusted" | "item"  | "personal"
                currency: selectCurrencyValue,
                amount: parseFloat(inputAmountValue || "0"),
                categoryId: selectCategoryValue, 
                time: inputTimeValue,
                desc: inputDescValue || "",
                payerMap: payerFinalMap,
                splitMap: splitFinalMap,
            };
          }, [inputPaymentValue,accountType,recordFinalWay,splitFinalWay,splitFinalMethod,selectCurrencyValue,inputAmountValue,selectCategoryValue,inputTimeValue,inputDescValue,payerFinalMap,splitFinalMap]);
        
        useEffect(() => {
            setPayload(payload);
            if (splitWay === 'item'){
                setItemPayloadList(localItemPayloadList || null)
            }
        }, [payload, setPayload, splitWay, localItemPayloadList,setLocalItemPayloadList, setItemPayloadList]);

        // css
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const labelClass = clsx("w-full font-medium truncate")
        const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
        const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
        const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end")
        console.log("userData", userData);

        return(
            <div className="w-full h-full pb-20 mb-20">
                <div>
                    {isSplitPayerOpen &&
                        <SplitPayer
                            isSplitPayerOpen = {isSplitPayerOpen}
                            onClose={() => setIsSplitPayerOpen(false)}
                            userList={userList}
                            inputAmountValue={inputAmountValue}
                            splitPayerMap={splitPayerMap}
                            setSplitPayerMap={setSplitPayerMap}
                        />
                    }
                    {isSplitByPersonOpen &&
                        <SplitByPerson
                            isSplitByPersonOpen = {isSplitByPersonOpen}
                            onClose={() => setIsSplitByPersonOpen(false)}
                            userList={userList}
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
                            userList={userList} 
                            inputAmountValue={inputAmountValue}
                            itemPayloadList = {localItemPayloadList} //回傳作為更新使用
                            setSplitByItemMap={setSplitByItemMap}
                            setItemPayloadList={setLocalItemPayloadList}
                            setSplitWay={setSplitWay} //回傳設定用
                        />
                    }
                </div>
                {accountType === 'personal' && (
                    <section className={`w-full px-1 h-full  pb-20 mb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                        <div className="max-w-xl w-full grid grid-cols-3 gap-2">
                            <div className='col-span-3 flex flex-col gap-2 items-end justify-end'>
                                <div
                                    className={`px-2 py-2 flex items-center justify-center gap-2 rounded-xl bg-sp-white-20 hover:bg-sp-green-100 active:bg-sp-green-200 cursor-pointer }`}
                                    onClick={() => {
                                        setAccountType('group')
                                    }}
                                >
                                    <p className="text-base ml-4">個人帳目</p>
                                    <IconButton
                                        icon="solar:unread-bold"
                                        size="sm"
                                        variant="text-button"
                                        color="primary"
                                        type="button"
                                    />
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
                                    value={selectCategoryValue}
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
                                                img={userData?.avatar}
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
                    </section>                
                )}
                {accountType === 'group' && (
                    <section className={`w-full px-1 h-full  pb-20 mb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                        <div className="max-w-xl w-full grid grid-cols-3 gap-2">
                            <div className='col-span-3 flex flex-col gap-2 items-end justify-end'>
                                <div
                                    className={`px-2 py-2 flex items-center justify-center gap-2 rounded-xl bg-sp-white-20 hover:bg-sp-green-100 active:bg-sp-green-200 cursor-pointer }`}
                                    onClick={() => {
                                        setAccountType('personal')
                                    }}
                                >
                                    <p className="text-base ml-4">個人帳目</p>
                                    <IconButton
                                        icon="solar:stop-line-duotone"
                                        size="sm"
                                        variant="text-button"
                                        color="primary"
                                        type="button"
                                    />
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
                                    value={selectCategoryValue}
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
                                        const user = userList.find(user => user.uid === uid);
                                        if (!user) return null;
                                        return (
                                        <div key={uid} className="px-3 py-3 flex items-center justify-start gap-2">
                                            <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                            <div className="shrink-0 flex items-center justify-center">
                                                <Avatar
                                                size="md"
                                                img={user.avatar}
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
                                    <div id="receipt-way" className="w-full my-4 flex max-w-xl bg-sp-white-20 rounded-xl">
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
                                    {userList
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
                                                    img={user.avatar}
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
                    </section>
                )}
            </div>
        )
}