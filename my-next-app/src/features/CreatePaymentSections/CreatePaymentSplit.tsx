import clsx from "clsx";
import { useState, useEffect} from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import Select from "@/components/ui/Select";
import { fetchCategoriesForSelect } from "@/lib/categoryApi";
import SplitPayer from "./SplitPayerDialog";
import SplitByPerson from "./SplitByPersonDialog";
import SplitByItem from "./SplitByItemDialog";
import { SplitDetail, SplitMap, PayerMap, User, SplitMethod, SplitWay, CreatePaymentPayload, CreateItemPayload, ReceiptWay } from "./types";
import { formatPercent, formatNumber } from "./utils";
import { getNowDatetimeLocal } from "@/utils/time";

interface CreatePaymentSplitProps {
    userList: User[];
    receiptWay: ReceiptWay;
    setReceiptWay: (value:ReceiptWay) => void;
    setSplitWay: (value:SplitWay) => void;
    setSplitMethod: (value:SplitMethod) => void;
    setPayload : (map: CreatePaymentPayload) => void;
    setItemPayload : (map: CreateItemPayload) => void;
}


export default function CreatePaymentSplit({
    userList,
    receiptWay,
    setReceiptWay,
    setSplitMethod,
    setPayload,
    setItemPayload
    }:CreatePaymentSplitProps){

        // receipt-split
        const [selectCurrencyValue, setSelectedCurrencyValue] = useState("TWD");
        const [inputAmountValue, setInputAmountValue] = useState("");
        const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string; disabled: boolean }[]>([]);
        const [selectCategoryValue, setSelectedCategoryValue] = useState("");
        const [inputPaymentValue, setInputPaymentValue] = useState("");
        const [inputTimeValue, setInputTimeValue] = useState(getNowDatetimeLocal());
        const [inputDescValue, setInputDescValue] = useState("");

        const [splitWay, setSplitWay] = useState<SplitWay>("person");
        const [chooseSplitByPerson, setChooseSplitByPerson] = useState<SplitMethod>("percentage");
        const [isSplitPayerOpen, setIsSplitPayerOpen] = useState(false);
        const [isSplitByPersonOpen, setIsSplitByPersonOpen] = useState(false);
        const [isSplitByItemOpen, setIsSplitByItemOpen] = useState(false);

        //  付款人預設
        const [splitPayerMap, setSplitPayerMap] = useState<PayerMap>({
            ["4kjf39480fjlk"]: parseFloat(inputAmountValue || "0") || 0
        });

        useEffect(() => {
            if(receiptWay === 'split' && userList.length > 0 && Number(inputAmountValue) > 0){
                const amount = parseFloat(inputAmountValue || "0");
                setSplitPayerMap({ ["4kjf39480fjlk"]: amount });
            }
        }, [inputAmountValue, receiptWay, userList]);


        // 還款人預設
        const [splitByPersonMap, setSplitByPersonMap] = useState<SplitMap>(() => {
            const total = Number(inputAmountValue) || 0;
            const percentValue = parseFloat((1 / userList.length).toFixed(4));;
            const average = Math.floor((total * percentValue) * 10000) / 10000;
            return Object.fromEntries(userList.map(user => [user.uid, {
                fixed: 0,
                percent: percentValue,
                total: average
            }]));
        });

        useEffect(() => {
            if ( receiptWay === "split" && userList.length > 0 && Number(inputAmountValue) > 0) {
                const amount = parseFloat(inputAmountValue || "0");
                const percent = parseFloat((1 / userList.length).toFixed(4));
                const total = Math.floor((amount * percent) * 10000) / 10000;
                const map: SplitMap = Object.fromEntries(
                    userList.map(user => [user.uid, {
                        fixed: 0,
                        percent: percent,
                        total: total
                    }])
                );
                setChooseSplitByPerson("percentage")
                setSplitByPersonMap(map);
            }
        }, [inputAmountValue, receiptWay, splitWay, userList]);

        console.log("付款人", splitPayerMap, "分帳方式", chooseSplitByPerson, "分帳人", splitByPersonMap)


        // 付款項目
        const [splitByItemMap, setSplitByItemMap] = useState<SplitMap>()

        // 金額輸入限制
        const handleSplitAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
          
            // 允許：空字串、整數、小數最多兩位
            const isValid = /^(\d+)?(\.\d{0,2})?$/.test(rawValue);
          
            if (isValid) {
              setInputAmountValue(rawValue);
            }
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
                Object.values(allEntries).map(e => e.percent.toFixed(4))
              );
              const isEvenSplit = uniquePercents.size === 1;
              return isEvenSplit ? '均分' : formatPercent(entry.percent);
            },
            actual: () => '實際支出',
            adjusted: () => '',
        };          
        const getTagDesc = tagDescMap[chooseSplitByPerson] || (() => '');

        // get data
        useEffect(() => {
            const payload: CreatePaymentPayload = {    
                paymentName: inputPaymentValue,
                receiptWay: 'split',    // "split" | "debt"
                splitWay: splitWay,      // "item" | "person"
                splitMethod: chooseSplitByPerson, // "percentage" | "actual" | "adjusted"
                currency: selectCurrencyValue,
                amount:  parseFloat(inputAmountValue || "0"),
                categoryId: selectCategoryValue,
                time: inputTimeValue,
                desc: inputDescValue || "",
                payerMap: splitPayerMap,
                splitMap: splitByPersonMap,
            };
            setPayload(payload);
            setReceiptWay('split')
        }, [selectCurrencyValue, inputAmountValue,selectCategoryValue,inputPaymentValue,inputTimeValue,inputDescValue,chooseSplitByPerson,splitPayerMap,splitByPersonMap,setPayload, setSplitWay, setReceiptWay, splitWay]);

        // css
        //const tokenCount: [number, number] = [inputAmountValue.length, 40];
        //const errorMessage = inputAmountValue.length > 40 ? '最多只能輸入 200 字最多只能輸入 200 字' : '';
  
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const labelClass = clsx("w-full font-medium truncate")
        const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
        const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
        const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end")
          
        
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
                        />
                    }
                    {isSplitByItemOpen &&
                        <SplitByItem
                            isSplitByItemOpen = {isSplitByItemOpen}
                            onClose={() => setIsSplitByItemOpen(false)}
                            userList={userList} 
                            inputAmountValue={inputAmountValue}
                            splitWay= "item"
                            setSplitWay={setSplitWay}
                            splitByItemMap={splitByItemMap}
                            setSplitByItemMap={setSplitByItemMap}
                        />
                    }
                </div>
                <section id="receipt-split"  className={`w-full h-full  pb-20 mb-20 flex items-start justify-start gap-5 ${scrollClass}`}>
                    <div id="receipt-form-frame" className="max-w-xl w-full grid grid-cols-3 gap-2">
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
                            onChange={handleSplitAmountChange}
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
                                        <p className="shrink-0 text-xl font-lg">${amount.toFixed(2)}</p>
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
                                        //disabled={isdisabled} 
                                        //isLoading={isLoading}
                                        onClick={() => {
                                            setIsSplitByItemOpen(true)
                                            setSplitWay('item')
                                        }}
                                        >
                                            項目分帳
                                    </Button>
                                    <Button
                                        size='sm'
                                        width='full'
                                        variant={splitWay == 'person' ? 'solid' : 'text-button'}
                                        color='primary'
                                        //disabled={isdisabled} 
                                        //isLoading={isLoading}
                                        onClick={() => {
                                            setIsSplitByPersonOpen(true)
                                            setSplitWay('person')
                                        }}
                                        >
                                            成員分帳
                                    </Button>
                                </div>
                            </div>
                            <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                {userList
                                    .filter(user => !!splitByPersonMap[user.uid])
                                    .map(user => {
                                    const entry = splitByPersonMap[user.uid];

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
                                            <div className="p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">{getTagDesc(entry, splitByPersonMap)}</div>
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
            </div>
        )
}