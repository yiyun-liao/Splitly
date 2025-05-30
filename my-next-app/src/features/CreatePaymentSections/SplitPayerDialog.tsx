import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { PayerMap, User } from "../../types/payment";
import { sanitizeDecimalInput } from "@/utils/parseAmount";
import { formatNumber } from "./utils";

interface SplitPayerProps {
    isSplitPayerOpen: boolean;
    onClose: () => void;
    userList: User[];
    inputAmountValue:string;
    splitPayerMap: PayerMap;
    setSplitPayerMap:  (map: PayerMap) => void;
}

export default function SplitPayer({
        isSplitPayerOpen = false,
        onClose,
        userList,
        inputAmountValue,
        splitPayerMap,
        setSplitPayerMap,
    }:SplitPayerProps){
    
    const [localPayerMap, setLocalPayerMap] = useState<PayerMap>({});

    useEffect(() => {
        if (isSplitPayerOpen) {
            const initialMap: PayerMap = {};
            userList.forEach(user => {
              initialMap[user.uid] = splitPayerMap[user.uid] ?? 0;
            });
            setLocalPayerMap(initialMap);
          }
    }, [isSplitPayerOpen, splitPayerMap, userList]);

    const remaining = useMemo(() => {
        const totalAmount = Object.values(localPayerMap).reduce((acc, cur) => acc + cur, 0);
        const totalTarget = parseFloat(inputAmountValue || "0");
        return totalTarget - totalAmount;
    }, [localPayerMap, inputAmountValue]);
    
    const isComplete = Math.abs(remaining) < 0.01;


    const handleAmountChange = (uid: string, value: string) => {
        const numeric = sanitizeDecimalInput(value);
        setLocalPayerMap((prev) => {
            return {
              ...prev,
              [uid]: numeric,
            };
        });
    };

    const remainingClass = clsx('shrink-0',
        {
        'text-red-500' : !isComplete,
        }
    )
    
    const renderFooter = () => {
        return(
            <div className="w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                <div className="w-full flex items-start justify-between gap-2 text-base">
                    <p className="wrap-break-word">支出總金額 ${inputAmountValue || '0'} 元</p>
                    <p className={remainingClass}>剩餘 {formatNumber(remaining)} 元</p>
                </div>
                <Button
                    size='sm'
                    width='full'
                    variant= 'solid'
                    color= 'primary'
                    disabled={!isComplete} 
                    onClick={() => {
                        const filteredMap = Object.fromEntries(
                            Object.entries(localPayerMap).filter(([_, amount]) => amount > 0)
                        );
                        setSplitPayerMap(filteredMap);
                        onClose()
                        // console.log("完成分帳後的 map：", filteredMap);
                    }}
                    >
                        完成
                </Button>
            </div>
        )
    }

    const renderBody = () => {
        return(
            <div>
                {userList.map((user) => {
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
                                    value={localPayerMap[user.uid]?.toString() || ""}
                                    type="number"
                                    onChange={(e) => handleAmountChange(user.uid, e.target.value)}
                                    flexDirection="row"
                                    width="full"
                                    placeholder="支出金額"
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return(
        <Dialog
                header="付款人"
                open={isSplitPayerOpen}
                onClose={ () => {
                    onClose();
                }} 
                footerClassName= "items-center justify-end"
                footer= {renderFooter()}
            >
                {renderBody()}
        </Dialog>
    )
}