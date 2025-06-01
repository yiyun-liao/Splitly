import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState, useEffect, useMemo } from "react";
import { SplitMap, SplitMethod,SplitWay } from "@/types/payment";
import { formatNumber,parsePercentToInt,parsePercentToDecimal, formatNumberForData, formatPercent } from "@/utils/parseNumber";
import { sanitizeDecimalInput } from "@/utils/parseAmount";
import clsx from "clsx";
import { UserData } from "@/types/user";


interface SplitByPersonProps {
    isSplitByPersonOpen: boolean;
    onClose: () => void;
    currentProjectUsers: UserData[];
    inputAmountValue:string;
    chooseSplitByPerson: SplitMethod;
    setChooseSplitByPerson: (value: SplitMethod) => void;
    splitByPersonMap: SplitMap;
    setSplitByPersonMap: (map: SplitMap) => void;
    setSplitWay:(map:SplitWay) => void;

}

export default function SplitByPerson({
        isSplitByPersonOpen = false,
        onClose,
        currentProjectUsers,
        inputAmountValue,
        chooseSplitByPerson,
        setChooseSplitByPerson,
        splitByPersonMap,
        setSplitByPersonMap,
        setSplitWay
    }:SplitByPersonProps){

    const [localChooseSplitByPerson, setLocalChooseSplitByPerson] = useState<SplitMethod>("percentage");

    const [rawPercentInputMap, setRawPercentInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const { percent = 0 } = splitByPersonMap[user.uid] || {};
                return [user.uid, parsePercentToInt(percent)];
            })
        );
    });
    
    const [localSplitPercentageMap, setLocalSplitPercentageMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const totalAmount = parseFloat(inputAmountValue || "0");
                const entry = splitByPersonMap[user.uid];
                const fixed = 0;
                const percent = entry?.percent || 0;
                const total = parseFloat(formatNumberForData(percent * totalAmount)) || 0;
                return [user.uid, { fixed, percent, total }];
            })
        );
    });

    const [rawActualInputMap, setRawActualInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const { total = 0 } = splitByPersonMap[user.uid] || {};
                return [user.uid, formatNumber(total)];
            })
        );
    });
    

    const [localSplitActualMap, setLocalSplitActualMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const entry = splitByPersonMap[user.uid];
                const fixed = entry?.total || 0;
                const percent = 0;
                const total = entry?.total || 0;
                return [user.uid, { fixed, percent, total }];
            })
        );
    });

    const [rawAdjustInputMap, setRawAdjustInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const { fixed = 0 } = splitByPersonMap[user.uid] || {};
                return [user.uid, formatNumber(fixed)];
            })
        );
    });
    
    const [localSplitAdjustedMap, setLocalSplitAdjustedMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            currentProjectUsers.map(user => {
                const totalAmount = parseFloat(inputAmountValue || "0");
                const totalFixed = Object.values(splitByPersonMap).reduce((sum, entry) => sum + (entry.fixed || 0), 0);
                const remaining = totalAmount - totalFixed;

                const entry = splitByPersonMap[user.uid];
                const fixed = entry?.fixed || 0;
                const percent = parseFloat(formatNumberForData(1 / currentProjectUsers.length));
                const total = fixed + parseFloat(formatNumberForData(remaining * percent));
                return [user.uid, { fixed, percent, total }];
            })
        );
    });
    
    useEffect(() => {
        if (isSplitByPersonOpen) {
            setLocalChooseSplitByPerson(chooseSplitByPerson);
    
            if (chooseSplitByPerson === 'percentage') {
                setLocalSplitPercentageMap(splitByPersonMap);
                setRawPercentInputMap(
                    Object.fromEntries(
                        currentProjectUsers.map(user => {
                            const { percent = 0 } = splitByPersonMap[user.uid] || {};
                            return [user.uid, parsePercentToInt(percent)];
                        })
                    )
                );
            }
    
            if (chooseSplitByPerson === 'actual') {
                setLocalSplitActualMap(splitByPersonMap);
                setRawActualInputMap(
                    Object.fromEntries(
                        currentProjectUsers.map(user => {
                            const { total = 0 } = splitByPersonMap[user.uid] || {};
                            return [user.uid, formatNumber(total)];
                        })
                    )
                );
            }
    
            if (chooseSplitByPerson === 'adjusted') {
                setLocalSplitAdjustedMap(splitByPersonMap);
                setRawAdjustInputMap(
                    Object.fromEntries(
                        currentProjectUsers.map(user => {
                            const { fixed = 0 } = splitByPersonMap[user.uid] || {};
                            return [user.uid, formatNumber(fixed)];
                        })
                    )
                );
            }
        }
    }, [isSplitByPersonOpen, splitByPersonMap, chooseSplitByPerson, inputAmountValue, currentProjectUsers]);
    
    
    const handlePercentageChange = (uid: string, percentInput: string) => {
        const rawPercent = sanitizeDecimalInput(percentInput);

        setRawPercentInputMap((prev) => ({
            ...prev,
            [uid]: rawPercent.toString(),
        }));
        if (isNaN(rawPercent) || rawPercent < 0) return; 
        const amount = parseFloat(inputAmountValue || "0");    
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
    
        const totalAmount = parseFloat(inputAmountValue || "0");
    
        // 所有 fixed 的總和並均分
        const totalFixed = Object.values(newMap).reduce((sum, entry) => sum + (entry.fixed || 0), 0);
        const remaining = totalAmount - totalFixed;
    
        // 更新每個人的 total 與 percent
        const updatedMap: SplitMap = {};
        currentProjectUsers.forEach(user => {
            const entry = newMap[user.uid] || { fixed: 0, percent: 0, total: 0 };
            const fixed = entry.fixed || 0;
            const percent = parseFloat(formatNumberForData(1 / currentProjectUsers.length));
            const total = entry.fixed + parseFloat(formatNumberForData(remaining * percent));
    
            updatedMap[user.uid] = { fixed, total, percent };
        });
    
        setLocalSplitAdjustedMap(updatedMap);
    };
    


    // render footer
    const {computedFooterInfo, isComplete } = useMemo(() => {
        const totalAmount = parseFloat(inputAmountValue || "0");
        const EPSILON = 0.015;
        let isComplete = false;
        let computedFooterInfo = "";

        if (localChooseSplitByPerson === "percentage") {
            const usedPercent = Object.values(localSplitPercentageMap).reduce((sum, entry) => sum + (entry.percent || 0),0);
            const remainingPercent = 1 - usedPercent;
            isComplete = Math.abs(remainingPercent) < EPSILON;
            computedFooterInfo = `目前剩餘 ${parsePercentToInt(remainingPercent)}%`;
        }
        if (localChooseSplitByPerson === "actual") {
            const usedAmount = Object.values(localSplitActualMap).reduce((sum, entry) => sum + (entry.total || 0),0);
            const remaining = totalAmount - usedAmount;
            isComplete = Math.abs(remaining) < EPSILON;
            computedFooterInfo = `目前剩餘 ${formatNumber(remaining)} 元`;
        }
    
        if (localChooseSplitByPerson === "adjusted") {
            const fixedSum = Object.values(localSplitAdjustedMap).reduce((sum, entry) => sum + (entry.fixed || 0),0);
            const remaining = totalAmount - fixedSum;
            isComplete = remaining > -0.015;
            computedFooterInfo = `剩餘 ${formatNumber(remaining)} 元將均分`;
        }
    
        return { computedFooterInfo, isComplete };
    }, [localChooseSplitByPerson, localSplitPercentageMap, localSplitActualMap, localSplitAdjustedMap, inputAmountValue]);
    
    const splitByPersonDescMap: Record<string, string> = {
        percentage: '每個人依比例分攤',
        actual: '每個人實際支出',
        adjusted: '扣除實際支出後剩餘均分',
      };
    const splitByPersonDesc = splitByPersonDescMap[localChooseSplitByPerson] || '';

    const splitByPersonTotalMap: Record<string, string> = {
        percentage: `/ 共計 100%`,
        actual: `/ 共計 ${inputAmountValue} 元`,
        adjusted: `/ 共計 ${inputAmountValue} 元`,
      };
    const splitByPersonTotal = splitByPersonTotalMap[localChooseSplitByPerson] || '';

    const finalChoose = () => {
        if (localChooseSplitByPerson === "percentage") {
            const newPercentageMap = Object.fromEntries(
                Object.entries(localSplitPercentageMap).filter(([, entry]) => entry.total > 0)
            );
            return newPercentageMap;
        }
    
        if (localChooseSplitByPerson === "actual") {
            const newActualMap = Object.fromEntries(
                Object.entries(localSplitActualMap).filter(([, entry]) => entry.total > 0)
            );
            return newActualMap;
        }
    
        if (localChooseSplitByPerson === "adjusted") {
            const newAdjustMap = Object.fromEntries(
                Object.entries(localSplitAdjustedMap).filter(([, entry]) => entry.total > 0)
            );
            return newAdjustMap;
        }
    
        return {};
    };
    
    const remainingClass = clsx('shrink-0  w-fit text-end',
        {
        'text-red-500' : !isComplete,
        }
    )

    const renderFooter = () => {
        return(
            <div className="w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                <div className="w-full flex items-center justify-end gap-4 text-base">
                    <p className={remainingClass}>{computedFooterInfo}</p>
                    <p className="shrink-0 w-fit text-end text-sm">{splitByPersonTotal}</p>
                </div>
                <Button
                    size='sm'
                    width='full'
                    variant= 'solid'
                    color= 'primary'
                    disabled={!isComplete}
                    onClick={() => {
                        setChooseSplitByPerson(localChooseSplitByPerson)
                        setSplitByPersonMap(finalChoose())
                        console.log("最終分帳方式", finalChoose())
                        onClose()
                        setSplitWay("person")
                    }}
                    >
                        完成
                </Button>
            </div>
        )
    }


    // render body
    const renderBody = () => {
        return(
            <div className="relative text-zinc-700">
                <div className="w-full pb-4 bg-zinc-50 sticky -top-4 z-20">
                    <div id="receipt-way" className=" w-full flex max-w-xl bg-sp-blue-200 rounded-xl">
                        <Button
                            size='sm'
                            width='full'
                            variant= {localChooseSplitByPerson == 'percentage' ? 'solid' : 'text-button'}
                            color= 'primary'
                            onClick={() => {
                                setLocalChooseSplitByPerson("percentage")

                            }}
                            >
                                均分
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={localChooseSplitByPerson == 'actual' ? 'solid' : 'text-button'}
                            color='primary'
                            onClick={() => setLocalChooseSplitByPerson("actual")}
                            >
                                金額
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={localChooseSplitByPerson == 'adjusted' ? 'solid' : 'text-button'}
                            color='primary'
                            onClick={() => setLocalChooseSplitByPerson("adjusted")}
                            >
                                特別額
                        </Button>
                    </div>
                    <p className="wrap-break-word py-2 px-2 text-sp-blue-500">{splitByPersonDesc}</p>
                </div>
                {localChooseSplitByPerson === 'percentage' && (
                    <div className="pt-2">
                        {currentProjectUsers.map((user) => {
                            const entry = localSplitPercentageMap[user.uid] ?? { fixed: 0, percent: 0, total: 0 };

                            return(
                                <div key={user.uid} className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={user?.avatarURL}
                                                userName = {user?.name}
                                            />
                                        </div>
                                        <p className="text-base w-full truncate">{user?.name}</p>
                                    </div>
                                    <div className="shrink-0 w-60 flex flex-col items-end justify-start pb-3">
                                        <div className="w-full flex items-start justify-start gap-2 ">
                                            <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                            <Input
                                                value={ rawPercentInputMap[user.uid]  ?? "" }
                                                type="number"
                                                onChange={(e) => handlePercentageChange(user.uid, e.target.value)}
                                                flexDirection="row"
                                                width="full"
                                                placeholder="支出金額"
                                                step="0.01"
                                                inputMode="decimal"                                                
                                            />
                                            <p className="shrink-0 w-fit h-9 text-base flex items-center justify-end"> %</p>
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
                {localChooseSplitByPerson === 'actual' && (
                    <div className="pt-2">
                        {currentProjectUsers.map((user) => {
                            return(
                                <div key={user.uid} className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={user?.avatarURL}
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
                {localChooseSplitByPerson === 'adjusted' && (
                    <div className="pt-2">
                        {currentProjectUsers.map((user) => {
                            const entry = localSplitAdjustedMap[user.uid] ?? { fixed: 0, percent: 0, total: 0 };

                            return(
                                <div key={user.uid} className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={user?.avatarURL}
                                                userName = {user?.name}
                                            />
                                        </div>
                                        <p className="text-base w-full truncate">{user?.name}</p>
                                    </div>
                                    <div className="shrink-0 w-60 flex flex-col items-end justify-start pb-3">
                                        <div className="w-full flex items-start justify-start gap-2 ">
                                            <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                            <Input
                                                value={(rawAdjustInputMap[user.uid]) || ""}
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
                                            + {formatPercent(1 / currentProjectUsers.length)} = {formatNumber(entry.total)} 元
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}                
            </div>
        )
    }

    return(
        <Dialog
                header="成員分帳"
                open={isSplitByPersonOpen} 
                onClose={ () => {
                    onClose();
                }}
                bodyClassName= "overflow-hidden"
                footerClassName= "items-center justify-end"
                footer= {renderFooter()}
            >
                {renderBody()}
        </Dialog>
    )
}