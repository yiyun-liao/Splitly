import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState, useEffect, useMemo } from "react";
import { SplitMap } from "./types";
import { formatPercent,formatNumber,parsePercentToInt,parsePercentToDecimal } from "./utils";
import clsx from "clsx";

interface User {
    avatar?: string;
    name?: string;
    uid:string;
}

interface SplitByPersonProps {
    isSplitByPersonOpen: boolean;
    onClose: () => void;
    userList: User[];
    inputAmountValue:string;
    chooseSplitByPerson: "percentage" | "actual" | "adjusted";
    setChooseSplitByPerson: (value: "percentage" | "actual" | "adjusted") => void;
    splitByPersonMap: SplitMap;
    setSplitByPersonMap: (map: SplitMap) => void;
}

export default function SplitByPerson({
        isSplitByPersonOpen = false,
        onClose,
        userList,
        inputAmountValue,
        chooseSplitByPerson,
        setChooseSplitByPerson,
        splitByPersonMap,
        setSplitByPersonMap
    }:SplitByPersonProps){

    const [localChooseSplitByPerson, setLocalChooseSplitByPerson] = useState<"percentage" | "actual" | "adjusted">();
    const [localSplitByPersonMap, setLocalSplitByPersonMap] =useState<SplitMap>();

    const [rawPercentInputMap, setRawPercentInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const entry = splitByPersonMap[user.uid];
                const percent = entry?.percent || 0;
                return [user.uid, parsePercentToInt(percent)];
            })
        );
    });

    const [localSplitPercentageMap, setLocalSplitPercentageMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const entry = splitByPersonMap[user.uid];
                const fixed = entry?.fixed || 0;
                const percent = entry?.percent || 0;
                const total = entry?.total || 0;
                return [user.uid, { fixed, percent, total }];
            })
        );
    });

    const [rawActualInputMap, setRawActualInputMap] = useState<Record<string, string>>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const entry = splitByPersonMap[user.uid];
                const fixed = entry?.total || 0;
                return [user.uid, fixed];
            })
        );
    });

    const [localSplitActualMap, setLocalSplitActualMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            userList.map(user => {
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
            userList.map(user => {
                const entry = splitByPersonMap[user.uid];
                const fixed = entry?.fixed || 0;
                return [user.uid, fixed];
            })
        );
    });

    const [localSplitAdjustedMap, setLocalSplitAdjustedMap] =useState<SplitMap>(() => {
        return Object.fromEntries(
            userList.map(user => {
                const entry = splitByPersonMap[user.uid];
                const fixed = entry?.fixed || 0;
                const percent = entry?.percent || 0;
                const total = entry?.total || 0;
                return [user.uid, { fixed, percent, total }];
            })
        );
    });
    
    useEffect(() => {
        if (isSplitByPersonOpen) {
            setLocalChooseSplitByPerson(chooseSplitByPerson);
            setLocalSplitByPersonMap(splitByPersonMap);
        if (Object.keys(localSplitPercentageMap).length === 0) {
            setLocalSplitPercentageMap(splitByPersonMap);
            setLocalSplitActualMap(splitByPersonMap);
            setLocalSplitAdjustedMap(splitByPersonMap);
        }
        }
    }, [isSplitByPersonOpen, splitByPersonMap, chooseSplitByPerson, localSplitPercentageMap, inputAmountValue]);



    const handlePercentageChange = (uid: string, percentInput: string) => {
        setRawPercentInputMap((prev) => ({
            ...prev,
            [uid]: percentInput,
        }));

        const rawPercent = parseFloat(percentInput);
        if (isNaN(rawPercent) || rawPercent < 0) return; 
        const amount = parseFloat(inputAmountValue || "0");    
        const percent = parsePercentToDecimal(rawPercent);
        const fixed = 0;
        const total = Math.floor((amount * percent) * 10000) / 10000;
        setLocalSplitPercentageMap((prev) => ({
            ...prev,
            [uid]: { fixed, percent, total },
        }));
    };

    const handleActualChange = (uid: string, actualInput: string) => {
        setRawActualInputMap((prev) => ({
            ...prev,
            [uid]: actualInput,
        }));

        const rawActual = parseFloat(actualInput);
        if (isNaN(rawActual) || rawActual < 0) return; 
    
        const percent = 0;
        const fixed = parseFloat(rawActual.toFixed(4));
        const total = fixed;
    
        setLocalSplitActualMap((prev) => ({
            ...prev,
            [uid]: { fixed, percent, total },
        }));
    };

    const handleAdjustChange = (uid: string, adjustInput: string) => {
        setRawAdjustInputMap((prev) => ({
            ...prev,
            [uid]: adjustInput,
        }));

        const rawAdjust = parseFloat(adjustInput);
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
        userList.forEach(user => {
            const entry = newMap[user.uid] || { fixed: 0, percent: 0, total: 0 };
            const fixed = entry.fixed || 0;
            const percent = entry.percent || 0;
            const total = entry.fixed + parseFloat((remaining * percent).toFixed(4));
    
            updatedMap[user.uid] = { fixed, total, percent };
        });
    
        setLocalSplitAdjustedMap(updatedMap);
    };
    


    // render footer
    const splitByPersonDescMap: Record<string, string> = {
        percentage: '每個人依比例分攤',
        actual: '每個人實際支出',
        adjusted: '扣除實際支出後剩餘均分',
      };
    const splitByPersonDesc = splitByPersonDescMap[chooseSplitByPerson] || '';

    const splitByPersonAmountMap: Record<string, string> = {
        percentage: '目前剩餘 {}% / 共計 100%',
        actual: '目前剩餘 {}元/ 共計 {} 元',
        adjusted: '剩餘 {}元將均分/ 共計 {} 元',
      };
    const splitByPersonAmount = splitByPersonAmountMap[chooseSplitByPerson] || '';
    
    const renderFooter = () => {
        return(
            <div className="w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                <div className="w-full flex items-start justify-between gap-2 text-base">
                    <p className="wrap-break-word">{splitByPersonDesc}</p>
                    <p className="shrink-0">{splitByPersonAmount}</p>
                </div>
                <Button
                    size='sm'
                    width='full'
                    variant= 'solid'
                    color= 'primary'
                    //disabled={isdisabled} 
                    //isLoading={!isComplete}
                    onClick={() => {
                        // setSplitByPersonMap(computedSplitMap);
                        onClose()
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
                            variant= {chooseSplitByPerson == 'percentage' ? 'solid' : 'text-button'}
                            color= 'primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            onClick={() => setChooseSplitByPerson("percentage")}
                            >
                                均分
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={chooseSplitByPerson == 'actual' ? 'solid' : 'text-button'}
                            color='primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            onClick={() => setChooseSplitByPerson("actual")}
                            >
                                金額
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={chooseSplitByPerson == 'adjusted' ? 'solid' : 'text-button'}
                            color='primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            onClick={() => setChooseSplitByPerson("adjusted")}
                            >
                                特別額
                        </Button>
                    </div>
                </div>
                {chooseSplitByPerson === 'percentage' && (
                    <div className="pt-2">
                        {userList.map((user) => {
                            const entry = localSplitPercentageMap[user.uid];

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
                                                value={ rawPercentInputMap[user.uid] || "" }
                                                type="number"
                                                onChange={(e) => handlePercentageChange(user.uid, e.target.value)}
                                                flexDirection="row"
                                                width="full"
                                                placeholder="支出金額"
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
                {chooseSplitByPerson === 'actual' && (
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
                                        />
                                        <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
                {chooseSplitByPerson === 'adjusted' && (
                    <div className="pt-2">
                        {userList.map((user) => {
                            const entry = localSplitAdjustedMap[user.uid];

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
                                            />
                                            <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                        </div>
                                        <p className="shrink-0 w-full mt-[-24px] text-base flex items-center justify-end text-zinc-500"> 
                                            + {formatPercent(entry.percent)} = {formatNumber(entry.total)} 元
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