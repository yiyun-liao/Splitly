import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState, useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { User, SplitMethod,SplitWay, SplitMap, CreateItemPayload } from "./types";
import { formatNumber,parsePercentToInt,parsePercentToDecimal,formatNumberForData, formatPercent } from "./utils";
import { sanitizeDecimalInput } from "@/utils/parseAmount";



interface SplitByItemEditProps {
    userList: User[];
    setStep: React.Dispatch<React.SetStateAction<"list" | "singleItem">>;
    initialPayload?:CreateItemPayload
    setItemPayload : (map: CreateItemPayload) => void;
    onDeleteItem?: () => void;
}

export default function SplitByItemEdit({
        userList = [] ,
        setStep,
        initialPayload,
        setItemPayload,
        onDeleteItem
    }:SplitByItemEditProps){

    const [localItemPayload, setLocalItemPayload] = useState<CreateItemPayload>()
    const splitWay: SplitWay = "item";
    const [chooseSplitByItem, setChooseSplitByItem] = useState<SplitMethod>("percentage");

    const [inputItemAmountValue, setInputItemAmountValue] = useState("");
    const [inputItemValue, setInputItemValue] = useState("");

    const itemSplitByPersonMap: SplitMap = Object.fromEntries(
        userList.map(user => [ user.uid, { fixed: 0, percent: 0, total: 0 }])
    );

    const [rawPercentInputMap, setRawPercentInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const { percent = 0 } = itemSplitByPersonMap[user.uid] || {};
                return [user.uid, parsePercentToInt(percent)];
            })
        );
    });    
    
    const [localSplitPercentageMap, setLocalSplitPercentageMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const totalAmount = parseFloat(inputItemAmountValue || "0");
                const entry = itemSplitByPersonMap[user.uid];
                const fixed = 0;
                const percent = parseFloat(formatNumberForData(entry?.percent)) || 0;
                const total = parseFloat(formatNumberForData(percent * totalAmount)) || 0;
                return [user.uid, { fixed, percent, total }];
            })
        );
    });

    const [rawActualInputMap, setRawActualInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const { total = 0 } = itemSplitByPersonMap[user.uid] || {};
                return [user.uid, formatNumber(total)];
            })
        );
    });

    const [localSplitActualMap, setLocalSplitActualMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const entry = itemSplitByPersonMap[user.uid];
                const fixed = parseFloat(formatNumberForData(entry?.total ))|| 0;
                const percent = 0;
                const total = parseFloat(formatNumberForData(entry?.total)) || 0;
                return [user.uid, { fixed, percent, total }];
            })
        );
    });

    const [rawAdjustInputMap, setRawAdjustInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const { fixed = 0 } = itemSplitByPersonMap[user.uid] || {};
                return [user.uid, fixed.toString()];
            })
        );
    });

    const [localSplitAdjustedMap, setLocalSplitAdjustedMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const totalAmount = parseFloat(inputItemAmountValue || "0");
                const totalFixed = Object.values(itemSplitByPersonMap).reduce((sum, entry) => sum + (entry.fixed || 0), 0);
                const remaining = totalAmount - totalFixed;

                const entry = itemSplitByPersonMap[user.uid];
                const fixed = entry?.fixed || 0;
                const percent = parseFloat(formatNumberForData(1 / userList.length));
                const total = fixed + parseFloat(formatNumberForData(remaining * percent));
                return [user.uid, { fixed, percent, total }];
            })
        );
    });

    
    // edit
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initialPayload || initializedRef.current) return;

        if (userList.length > 0) {
            const amount = parseFloat(inputItemAmountValue || "0");
            const percent = parseFloat(formatNumberForData(1 / userList.length));
            const total = parseFloat(formatNumberForData(amount * percent));
    
            // percentage
            const percentageMap: SplitMap = Object.fromEntries(
                userList.map(user => [user.uid, {
                    fixed: 0,
                    percent: percent,
                    total: total
                }])
            );
            setLocalSplitPercentageMap(percentageMap);
            setRawPercentInputMap(Object.fromEntries(
                userList.map(user => [user.uid, parsePercentToInt(percent)])
            ));
    
            // actual
            const actualMap: SplitMap = Object.fromEntries(
                userList.map(user => [user.uid, {
                    fixed: total,
                    percent: 0,
                    total: total
                }])
            );
            setLocalSplitActualMap(actualMap);
            setRawActualInputMap(Object.fromEntries(
                userList.map(user => [user.uid, formatNumber(total)])
            ));
    
            // adjusted
            const adjustedMap: SplitMap = Object.fromEntries(
                userList.map(user => [user.uid, {
                    fixed: 0,
                    percent: percent,
                    total: total
                }])
            );
            setLocalSplitAdjustedMap(adjustedMap);
            setRawAdjustInputMap(Object.fromEntries(
                userList.map(user => [user.uid, "0"])
            ));
    
            // 預設為 percentage
            setChooseSplitByItem("percentage");
        }
    }, [inputItemAmountValue, splitWay, userList, initialPayload]);

    // update 
    useEffect(() => {
        if (initializedRef.current || !initialPayload || userList.length === 0) return;

        initializedRef.current = true;
        setInputItemValue(initialPayload.payment_name);
        setInputItemAmountValue(initialPayload.amount.toString());
        setChooseSplitByItem(initialPayload.split_method);
      
        const map = initialPayload.split_map;
      
        if (initialPayload.split_method === 'percentage') {
            setLocalSplitPercentageMap(map);
            setRawPercentInputMap(
                Object.fromEntries(
                    Object.entries(map).map(([uid, entry]) => [uid, parsePercentToInt(entry.percent)])
                )
            );
        }
        
        if (initialPayload.split_method === 'actual') {
            setLocalSplitActualMap(map);
            setRawActualInputMap(
                Object.fromEntries(
                    Object.entries(map).map(([uid, entry]) => [uid, formatNumber(entry.total)])
                )
            );
        }
        
        if (initialPayload.split_method === 'adjusted') {
            setLocalSplitAdjustedMap(map);
            setRawAdjustInputMap(
                Object.fromEntries(
                    Object.entries(map).map(([uid, entry]) => [uid, formatNumber(entry.fixed)])
                )
            );
        }
        
    }, [initialPayload, userList]);

    const handlePercentageChange = (uid: string, percentInput: string) => {
        const rawPercent = sanitizeDecimalInput(percentInput);

        setRawPercentInputMap((prev) => ({
            ...prev,
            [uid]: rawPercent.toString(),
        }));
        if (isNaN(rawPercent) || rawPercent < 0) return; 
        const amount = parseFloat(inputItemAmountValue || "0");    
        const percent = parsePercentToDecimal(rawPercent);
        const fixed = 0;
        const total = parseFloat(formatNumberForData(amount * percent));
        setLocalSplitPercentageMap((prev) => ({
            ...prev,
            [uid]: { fixed, percent, total },
        }));
    };

    const handleActualChange = (uid: string, actualInput: string) => {
        const rawActual = sanitizeDecimalInput(actualInput);

        setRawActualInputMap((prev) => ({
            ...prev,
            [uid]: rawActual.toString(),
        }));
        if (isNaN(rawActual) || rawActual < 0) return;     
        const percent = 0;
        const fixed = parseFloat(formatNumberForData(rawActual));
        const total = fixed;
    
        setLocalSplitActualMap((prev) => ({
            ...prev,
            [uid]: { fixed, percent, total },
        }));
    };

    const handleAdjustChange = (uid: string, adjustInput: string) => {
        const rawAdjust = sanitizeDecimalInput(adjustInput);

        setRawAdjustInputMap((prev) => ({
            ...prev,
            [uid]: rawAdjust.toString(),
        }));
        if (isNaN(rawAdjust) || rawAdjust < 0) return; 
        updateAdjustedSplitMap(uid, rawAdjust)
    };

    const updateAdjustedSplitMap = (updatedUid: string, updatedFixed: number) => {
        const newMap: SplitMap = {
            ...localSplitAdjustedMap,
            [updatedUid]: {
                ...localSplitAdjustedMap[updatedUid],
                fixed: updatedFixed,
            },
        };
    
        const totalAmount = parseFloat(inputItemAmountValue || "0");
    
        // 所有 fixed 的總和並均分
        const totalFixed = Object.values(newMap).reduce((sum, entry) => sum + (entry.fixed || 0), 0);
        const remaining = totalAmount - totalFixed;
    
        // 更新每個人的 total 與 percent
        const updatedMap: SplitMap = {};
        userList.forEach(user => {
            const entry = newMap[user.uid] || { fixed: 0, percent: 0, total: 0 };
            const fixed = entry.fixed || 0;
            const percent = parseFloat(formatNumberForData(1 / userList.length));
            const total = entry.fixed + parseFloat(formatNumberForData(remaining * percent));
    
            updatedMap[user.uid] = { fixed, total, percent };
        });
    
        setLocalSplitAdjustedMap(updatedMap);
    };


    // 金額輸入限制
    const handleSplitAmountChange = (input:string) => {
        const rawValue = sanitizeDecimalInput(input);
        setInputItemAmountValue(rawValue.toString());
    };    

    // render body
    const labelClass = clsx("w-full font-medium truncate")
    const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
    const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")

    // render footer
    const {computedFooterInfo, isComplete } = useMemo(() => {
        const totalAmount = parseFloat(inputItemAmountValue || "0");
        const EPSILON = 0.015;
        let isComplete = false;
        let computedFooterInfo = "";

        if (chooseSplitByItem === "percentage") {
            const usedPercent = Object.values(localSplitPercentageMap).reduce((sum, entry) => sum + (entry.percent || 0),0);
            const remainingPercent = 1 - usedPercent;
            isComplete = Math.abs(remainingPercent) < EPSILON;
            computedFooterInfo = `目前剩餘 ${formatPercent(remainingPercent)}`;
        }
        if (chooseSplitByItem === "actual") {
            const usedAmount = Object.values(localSplitActualMap).reduce((sum, entry) => sum + (entry.total || 0),0);
            const remaining = totalAmount - usedAmount;
            isComplete = Math.abs(remaining) < EPSILON;
            computedFooterInfo = `目前剩餘 ${formatNumber(remaining)} 元`;
        }
    
        if (chooseSplitByItem === "adjusted") {
            const fixedSum = Object.values(localSplitAdjustedMap).reduce((sum, entry) => sum + (entry.fixed || 0),0);
            const remaining = totalAmount - fixedSum;
            isComplete = remaining > -0.015;
            computedFooterInfo = `剩餘 ${formatNumber(remaining)} 元將均分`;
        }
    
        return { computedFooterInfo, isComplete };
    }, [inputItemAmountValue, chooseSplitByItem, localSplitActualMap, localSplitAdjustedMap, localSplitPercentageMap]);

    const splitByItemDescMap: Record<string, string> = {
        percentage: '每個人依比例分攤',
        actual: '每個人實際支出',
        adjusted: '扣除實際支出後剩餘均分',
        };
    const splitByItemDesc = splitByItemDescMap[chooseSplitByItem] || '';

    const splitByItemTotalMap: Record<string, string> = {
        percentage: `/ 共計 100%`,
        actual: `/ 共計 ${inputItemAmountValue} 元`,
        adjusted: `/ 共計 ${inputItemAmountValue} 元`,
        };
    const splitByItemTotal = splitByItemTotalMap[chooseSplitByItem] || '';

    const remainingClass = clsx('shrink-0 w-fit text-end',
        {
        'text-red-500' : !isComplete,
        }
    )

    // get data
    const payload: CreateItemPayload = useMemo(() => {
        let newSplitMap: SplitMap = {};

        if (chooseSplitByItem === "percentage") {
            newSplitMap = Object.fromEntries(
                Object.entries(localSplitPercentageMap).filter(([_, entry]) => entry.total > 0)
            );
        } else if (chooseSplitByItem === "actual") {
            newSplitMap = Object.fromEntries(
                Object.entries(localSplitActualMap).filter(([_, entry]) => entry.total > 0)
            );
        } else if (chooseSplitByItem === "adjusted") {
            newSplitMap = Object.fromEntries(
                Object.entries(localSplitAdjustedMap).filter(([_, entry]) => entry.total > 0)
            );
        }

        return {
            payment_id:"",
            amount: parseFloat(inputItemAmountValue  || "0"),
            payment_name: inputItemValue,
            split_method: chooseSplitByItem, // "percentage" | "actual" | "adjusted"
            split_map: newSplitMap,
        };
        }, [chooseSplitByItem, inputItemAmountValue, inputItemValue, localSplitActualMap, localSplitAdjustedMap, localSplitPercentageMap]);
    
    useEffect(() => {
        setLocalItemPayload(payload);
    }, [payload, setItemPayload]);

    return(
        <div className="flex flex-col h-full">
            <div className="w-full flex-1 px-1 pt-2 pb-20  h-full relative text-zinc-700 overflow-y-auto">                                
                <div id="receipt-form-frame" className="max-w-xl w-full grid grid-cols-3 gap-2">
                    <div className={formSpan2CLass}>
                        <span className={labelClass}>名稱</span>
                        <Input
                            value={inputItemValue}
                            type="text"
                            onChange={(e) => setInputItemValue(e.target.value)}
                            flexDirection="row"
                            width="full"
                            placeholder="點擊編輯"
                        />
                    </div>
                    <div className={formSpan1CLass}>
                        <span className={labelClass}>費用</span>
                        <Input
                        value={inputItemAmountValue}
                        type="number"
                        onChange={(e)=>{handleSplitAmountChange(e.target.value)}}
                        flexDirection="row"
                        width="full"
                        placeholder="點擊編輯"
                        step="0.01"
                        inputMode="decimal" 
                        />
                    </div>
                </div>
                <div className="w-full pb-4 bg-zinc-50 sticky -top-2 z-20">
                    <div id="receipt-way" className=" w-full flex max-w-xl bg-sp-blue-200 rounded-xl">
                        <Button
                            size='sm'
                            width='full'
                            variant= {chooseSplitByItem == 'percentage' ? 'solid' : 'text-button'}
                            color= 'primary'
                            onClick={() => setChooseSplitByItem("percentage")}
                            >
                                均分
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={chooseSplitByItem == 'actual' ? 'solid' : 'text-button'}
                            color='primary'
                            onClick={() => setChooseSplitByItem("actual")}
                            >
                                金額
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={chooseSplitByItem == 'adjusted' ? 'solid' : 'text-button'}
                            color='primary'
                            onClick={() => setChooseSplitByItem("adjusted")}
                            >
                                特別額
                        </Button>
                    </div>
                    <p className="wrap-break-word py-2 px-2 text-sp-blue-500">{splitByItemDesc}</p>
                </div>
                {chooseSplitByItem === 'percentage' && (
                    <div className="pt-2">
                    {userList.map((user) => {
                        const entry = localSplitPercentageMap[user.uid] ?? { fixed: 0, percent: 0, total: 0 };
                        
                        return(
                            <div key={user.uid} className="px-3 pb-2 flex items-start justify-start gap-2">
                                <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                    <div  className="shrink-0 flex items-center justify-center ">
                                        <Avatar
                                            size="md"
                                            img={user?.avatar}
                                            userName = {user?.name}
                                        />
                                    </div>
                                    <p className="text-base w-full truncate">{user?.name}</p>
                                </div>
                                <div  className="shrink-0 w-60 flex flex-col items-end justify-start pb-3">
                                    <div className="w-full flex items-start justify-start gap-2 ">
                                        <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                        <Input
                                            value={ rawPercentInputMap[user.uid]  ?? "" }
                                            type="number"
                                            onChange={(e) => handlePercentageChange(user.uid, e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="支出比例"
                                        />
                                        <p className="shrink-0 h-9 text-base flex items-center">%</p>
                                    </div>
                                    <p className="shrink-0 w-full mt-[-24px] text-base flex items-center justify-end text-zinc-500"> 
                                        = {formatNumber(entry.total)} 元
                                    </p>                                        
                                </div>
                            </div>
                        )
                    })}
                    </div>
                )}
                {chooseSplitByItem === 'actual' && (
                    <div className="pt-2">
                        {userList.map((user) => {
                            return(
                                <div key={user.uid} className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={user?.avatar}
                                                userName = {user?.name}
                                            />
                                        </div>
                                        <p className="text-base w-full truncate">{user?.name}</p>
                                    </div>
                                    <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                        <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                        <Input
                                            value={rawActualInputMap[user.uid]|| ""}
                                            type="number"
                                            onChange={(e) => handleActualChange(user.uid, e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="支出金額"
                                            step="0.01"
                                            inputMode="decimal"
                                        />
                                        <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                {chooseSplitByItem === 'adjusted' && (
                    <div className="pt-2">
                        {userList.map((user) => {
                            const entry = localSplitAdjustedMap[user.uid] ?? { fixed: 0, percent: 0, total: 0 };

                            return(
                                <div key={user.uid} className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={user?.avatar}
                                                userName = {user?.name}
                                            />
                                        </div>
                                        <p className="text-base w-full truncate">{user?.name}</p>
                                    </div>
                                    <div className="shrink-0 w-60 flex flex-col items-end justify-start pb-3">
                                        <div className="w-full flex items-start justify-start gap-2 ">
                                            <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                            <Input
                                                value={rawAdjustInputMap[user.uid] || ""}
                                                type="number"
                                                onChange={(e) => handleAdjustChange(user.uid, e.target.value)}
                                                flexDirection="row"
                                                width="full"
                                                placeholder="支出金額"
                                                step="0.01"
                                                inputMode="decimal"                                                
                                            />
                                            <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                        </div>
                                        <p className="shrink-0 w-full mt-[-24px] text-base flex items-center justify-end text-zinc-500"> 
                                            + {formatPercent(1 / userList.length)} = {formatNumber(entry.total)} 元
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}                         
            </div>
            <div className="shrink-0 pt-2 w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                <div className="w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                    <div className="w-full flex items-center justify-end gap-4 text-base">
                        <p className={remainingClass}>{computedFooterInfo}</p>
                        <p className="shrink-0 w-fit text-end text-sm">{splitByItemTotal}</p>
                    </div>
                    <div className="flex w-full gap-4">
                        {initialPayload && onDeleteItem &&(
                            <div className="shrink-0 w-40">
                                <Button
                                    size='sm'
                                    width='full'
                                    variant= 'outline'
                                    color= 'primary'
                                    onClick={() => {
                                        onDeleteItem();   
                                        setStep('list');                                                                           
                                    }}
                                    >
                                        刪除項目
                                </Button>
                            </div>
                        )}
                        <Button
                            size='sm'
                            width='full'
                            variant= 'solid'
                            color= 'primary'
                            disabled={!isComplete}
                            onClick={() => {
                                if (localItemPayload) {
                                    setItemPayload(localItemPayload);
                                    console.log(inputItemValue, localItemPayload)
                                    setStep('list');
                                }
                            }}
                            >
                                儲存項目
                        </Button>
                    </div>
                </div>                 
            </div>
        </div>
    )
}