// updated SplitByItemEditDialog.tsx

import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import clsx from "clsx";
import { useState, useEffect, useMemo, useRef } from "react";
import { UserData } from "@/types/user";
import { SplitMethod,  CreateItemPayload, SplitMap } from "@/types/payment";
import { sanitizeDecimalInput } from "@/utils/parseAmount";
import { useSplitPercentageMap } from "./hooks/useSplitPercentageMap";
import { useSplitActualMap } from "./hooks/useSplitActualMap";
import { useSplitAdjustedMap } from "./hooks/useSplitAdjustMap";
import { useIsMobile } from "@/hooks/useIsMobile";
import { validateInput, tokenTest } from "@/utils/validate";
import { formatPercent, formatNumberForData } from "@/utils/parseNumber";



interface SplitByItemEditProps {
    currentProjectUsers: UserData[];
    setStep: React.Dispatch<React.SetStateAction<"list" | "singleItem">>;
    initialPayload?: CreateItemPayload;
    setItemPayload: (map: CreateItemPayload) => void;
    onDeleteItem?: () => void;
}

export default function SplitByItemEdit({
    currentProjectUsers = [],
    setStep,
    initialPayload,
    setItemPayload,
    onDeleteItem,
}: SplitByItemEditProps) {
    const [inputItemValue, setInputItemValue] = useState("品項");
    const [inputItemAmountValue, setInputItemAmountValue] = useState("");
    const [chooseSplitByItem, setChooseSplitByItem] = useState<SplitMethod>("percentage");
 
    // 還款人預設
    const [splitMap, setSplitMap] = useState<SplitMap>();
    const isMobile = useIsMobile();    
    // console.log("預設產品分帳資料", initialPayload)

    const isInitialLoadingRef = useRef(true);
    // 價格改變就重設
    const didManuallyChangeAmountRef = useRef(false);

    // prepare hooks
    const percentageHook = useSplitPercentageMap({
        currentProjectUsers,
        inputAmountValue: inputItemAmountValue,
        initialMap: splitMap || {},
        manualReset: didManuallyChangeAmountRef.current,
    });
    const actualHook = useSplitActualMap({
        currentProjectUsers,
        inputAmountValue: inputItemAmountValue,
        initialMap: splitMap || {},
        manualReset: didManuallyChangeAmountRef.current,

    });
    const adjustedHook = useSplitAdjustedMap({
        currentProjectUsers,
        inputAmountValue: inputItemAmountValue,
        initialMap: splitMap || {},
        manualReset: didManuallyChangeAmountRef.current,
    });

    const activeHook =
        chooseSplitByItem === "percentage"
        ? percentageHook
        : chooseSplitByItem === "actual"
        ? actualHook
        : adjustedHook;

    const { localMap, rawInputMap, handleChange, computeFooterInfo, generateFinalMap } = activeHook;

    // restore payload from props
    useEffect(() => {
        if (!initialPayload) return;
        isInitialLoadingRef.current = true;
        setInputItemValue(initialPayload.payment_name);
        setInputItemAmountValue(initialPayload.amount.toString());
        setChooseSplitByItem(initialPayload.split_method);
        setSplitMap(initialPayload.split_map)
    }, [initialPayload]);

    // 金額輸入限制，onChange handler 內設為 true（代表使用者手動輸入）
    const handleSplitAmountChange = (actualInput: string) => {
        const rawValue = sanitizeDecimalInput(actualInput);
        if (isNaN(rawValue) || rawValue < 0) return; 
        setInputItemAmountValue(rawValue.toString());
        didManuallyChangeAmountRef.current = true;
    };

    useEffect(() => {
        // 第一次因 initialPayload 設定 inputValue ➜ 跳過一次
        if (isInitialLoadingRef.current) {
            isInitialLoadingRef.current = false;
            return;
        }
        if (!didManuallyChangeAmountRef.current) return;
        
        setSplitMap({});
        const amount = parseFloat(inputItemAmountValue || "0");
        const percent = parseFloat(formatNumberForData(1 / currentProjectUsers.length));
        const total = parseFloat(formatNumberForData(amount * percent))
        const groupMap: SplitMap = Object.fromEntries(
            currentProjectUsers.map(user => [user.uid, {
                fixed: 0,
                percent: percent,
                total: total
            }])
        );
        setSplitMap(groupMap);
        setChooseSplitByItem('percentage');
        console.log('改價格',amount, groupMap)
        didManuallyChangeAmountRef.current = false;

    }, [inputItemAmountValue, currentProjectUsers, initialPayload]);

    // watch and update payload
    const finalSplitMap = generateFinalMap();

    const payload: CreateItemPayload = useMemo(() => {
        return {
            payment_id: "",
            amount: parseFloat(inputItemAmountValue || "0"),
            payment_name: inputItemValue,
            split_method: chooseSplitByItem,
            split_map: finalSplitMap,
        };
    }, [inputItemAmountValue, inputItemValue, chooseSplitByItem, finalSplitMap]);

    // 輸入測試
    const itemNameAvoidInjectionTest = validateInput(inputItemValue);
    const itemNameTokenTest = tokenTest(inputItemValue);

    const isAmountEmpty = useMemo(() => {
        const amount = parseFloat(inputItemAmountValue);
        return !inputItemAmountValue || isNaN(amount) || amount <= 0;
    }, [inputItemAmountValue]);

    const labelClass = clsx("w-full font-medium truncate");
    const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end");
    const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end");

    const splitByItemDescMap: Record<string, string> = {
        percentage: "每個人依比例分攤",
        actual: "每個人實際支出",
        adjusted: "扣除實際支出後剩餘均分",
    };
    const splitByItemTotalMap: Record<string, string> = {
        percentage: "/ 共計 100%",
        actual: `/ 共計 ${inputItemAmountValue} 元`,
        adjusted: `/ 共計 ${inputItemAmountValue} 元`,
    };

    const remainingClass = clsx("shrink-0 w-fit text-end", {
        "text-red-500": !computeFooterInfo.isComplete,
    });

    // console.log("[item] payloadList", JSON.stringify(payload, null, 2));

    return (
        <div className="flex flex-col h-full">
            <div className="w-full flex-1 px-1 pt-2 pb-20 h-full relative text-zinc-700 overflow-y-auto">
                <div className="max-w-xl w-full grid grid-cols-3 gap-2 pb-4">
                    <div className={formSpan2CLass}>
                        <span className={labelClass}>名稱</span>
                        <Input
                            value={inputItemValue}
                            type="text"
                            onChange={e => setInputItemValue(e.target.value)}
                            width="full"
                            placeholder="點擊編輯"
                            errorMessage={itemNameAvoidInjectionTest ? itemNameAvoidInjectionTest : itemNameTokenTest ? itemNameTokenTest : undefined}
                            tokenMaxCount={[inputItemValue.length, 20] }  
                        />
                    </div>
                    <div className={formSpan1CLass}>
                        <span className={labelClass}>費用</span>
                        <Input
                            value={inputItemAmountValue}
                            type="number"
                            onChange={e => handleSplitAmountChange(e.target.value)}
                            width="full"
                            placeholder="點擊編輯"
                            step="0.01"
                            inputMode="decimal"
                        />
                    </div>
                </div>
                <div className="w-full pb-4 bg-zinc-50 sticky -top-2 z-12">
                    <div className="w-full flex bg-sp-blue-200 rounded-xl">
                        {["percentage", "actual", "adjusted"].map(method => (
                            <Button
                                key={method}
                                size="sm"
                                width="full"
                                variant={chooseSplitByItem === method ? "solid" : "text-button"}
                                color="primary"
                                onClick={() => setChooseSplitByItem(method as SplitMethod)}
                            >
                                {method === "percentage" ? "均分" : method === "actual" ? "金額" : "特別額"}
                            </Button>
                        ))}
                    </div>
                    <p className="py-2 px-2 text-sp-blue-500">{splitByItemDescMap[chooseSplitByItem]}</p>
                </div>
                {!isAmountEmpty && (
                    <div className="pt-2">
                    {currentProjectUsers.map(user => {
                        const entry = localMap[user.uid] ?? { fixed: 0, percent: 0, total: 0 };

                        return (
                        <div key={user.uid} className={`px-3 pb-2 flex items-start gap-2  ${isMobile ? 'flex-col' : 'flex-row'}`}>
                            <div className="min-h-9 w-full flex items-center gap-2 overflow-hidden">
                                <div className="shrink-0">
                                    <Avatar size="md" img={user.avatarURL} userName={user.name} />
                                </div>
                            <p className="text-base w-full truncate">{user.name}</p>
                            </div>
                            <div className={`shrink-0 flex flex-col items-end pb-3 ${isMobile ? 'min-w-60 w-full' : 'w-60'}`} >
                                <div className="w-full flex items-start gap-2">
                                    <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                    <Input
                                        value={rawInputMap[user.uid] ?? ""}
                                        type="number"
                                        onChange={e => handleChange(user.uid, e.target.value)}
                                        flexDirection="row"
                                        width="full"
                                        placeholder="支出金額"
                                        step="0.01"
                                        inputMode="decimal"
                                    />
                                    <p className="shrink-0 h-9 text-base flex items-center">
                                    {chooseSplitByItem === "percentage" ? "%" : "元"}
                                    </p>
                                </div>
                                <p className="shrink-0 w-full mt-[-24px] text-sm flex justify-end text-zinc-500">
                                {chooseSplitByItem === 'adjusted' ? `+ ${formatPercent(1/currentProjectUsers.length)} = ${entry.total.toFixed(2)} 元`  : `= ${entry.total.toFixed(2)} 元`}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                )}
            </div>
            <div className="shrink-0 pt-2 w-full flex flex-col gap-2 text-base text-zinc-700">
                <div className="w-full flex items-center justify-end gap-4 text-base">
                    <p className={remainingClass}>{computeFooterInfo.infoText}</p>
                    <p className="shrink-0 text-sm">{splitByItemTotalMap[chooseSplitByItem]}</p>
                </div>
                <div className="flex w-full gap-4">
                    {initialPayload && onDeleteItem && (
                        <div className="shrink-0 w-40">
                        <Button
                            size="sm"
                            width="full"
                            variant="outline"
                            color="primary"
                            onClick={() => {
                                onDeleteItem();
                                setStep("list");
                            }}
                        >
                            刪除項目
                        </Button>
                        </div>
                    )}
                    <Button
                        size="sm"
                        width="full"
                        variant="solid"
                        color="primary"
                        disabled={!computeFooterInfo.isComplete || !!itemNameAvoidInjectionTest || !!itemNameTokenTest || parseFloat(inputItemAmountValue) <= 0}
                        onClick={() => {
                            setItemPayload(payload);
                            setStep("list");
                        }}
                    >
                        儲存項目
                    </Button>
                </div>
            </div>
        </div>
    );
}
