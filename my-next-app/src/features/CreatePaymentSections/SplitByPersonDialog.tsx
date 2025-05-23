import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState, useEffect, useMemo } from "react";
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
    splitByPersonMap: Record<string, number>;
    setSplitByPersonMap:  (map: Record<string, number>) => void;
}

export default function SplitByPerson({
        isSplitByPersonOpen = false,
        onClose,
        userList,
        inputAmountValue,
        splitByPersonMap,
        setSplitByPersonMap
    }:SplitByPersonProps){

    const [chooseSplitByPerson, setChooseSplitByPerson] = useState<"percentage" | "actual" | "adjusted">("percentage");
    const [localByPersonMap, setLocalByPersonMap] = useState<Record<string, number>>({});

    
    useEffect(() => {
        if (isSplitByPersonOpen) {
            setLocalByPersonMap(splitByPersonMap);
        }
    }, [isSplitByPersonOpen, splitByPersonMap]);

    const computedSplitMap = useMemo(() => {
        const total = parseFloat(inputAmountValue || "0");
      
        if (total <= 0 || userList.length === 0) return {};
      
        if (chooseSplitByPerson === "percentage") {
          // 比例模式
          const totalPercentage = Object.values(localByPersonMap).reduce((acc, cur) => acc + cur, 0);
          if (totalPercentage === 0) return {};
      
          return Object.fromEntries(
            userList.map((user) => {
              const percent = localByPersonMap[user.uid] || 0;
              const amount = (percent / 100) * total;
              return [user.uid, Math.round(amount * 100) / 100]; // 四捨五入到小數點 2 位
            })
          );
        }
      
        if (chooseSplitByPerson === "actual") {
          // 金額模式，直接使用輸入值
          return Object.fromEntries(
            userList.map((user) => {
              const amount = localByPersonMap[user.uid] || 0;
              return [user.uid, Math.round(amount * 100) / 100];
            })
          );
        }
      
        if (chooseSplitByPerson === "adjusted") {
          // 特別額 + 平均分攤剩餘
          const specifiedUsers = userList.filter((user) => (localByPersonMap[user.uid] || 0) > 0);
          const unspecifiedUsers = userList.filter((user) => !(localByPersonMap[user.uid] > 0));
          const specifiedTotal = specifiedUsers.reduce(
            (sum, user) => sum + (localByPersonMap[user.uid] || 0),
            0
          );
          const remaining = total - specifiedTotal;
          const avg = unspecifiedUsers.length > 0 ? remaining / unspecifiedUsers.length : 0;
      
          return Object.fromEntries(
            userList.map((user) => {
              const fixedAmount = localByPersonMap[user.uid] || 0;
              const amount = fixedAmount > 0 ? fixedAmount : avg;
              return [user.uid, Math.round(amount * 100) / 100];
            })
          );
        }
      
        return {};
      }, [chooseSplitByPerson, localByPersonMap, inputAmountValue, userList]);
      


    const isComplete = useMemo(() => {
        const total = parseFloat(inputAmountValue || "0");
        const sum = Object.values(computedSplitMap).reduce((acc, cur) => acc + cur, 0);
        return Math.abs(total - sum) < 0.01;
    }, [computedSplitMap, inputAmountValue]);

    const handleAmountChange = (uid: string, value: string) => {
        const numeric = parseFloat(value || "0");
        setLocalByPersonMap((prev) => {
            return {
              ...prev,
              [uid]: numeric,
            };
        });
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
                    isLoading={!isComplete}
                    onClick={() => {
                        setSplitByPersonMap(computedSplitMap);
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
                                            value={localByPersonMap[user.uid]?.toString() || ""}
                                            type="number"
                                            onChange={(e) => handleAmountChange(user.uid, e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="支出比例"
                                        />
                                        <p className="shrink-0 h-9 text-base flex items-center">%</p>
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
                                            value={localByPersonMap[user.uid]?.toString() || ""}
                                            type="number"
                                            onChange={(e) => handleAmountChange(user.uid, e.target.value)}
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
                                    <div  className="shrink-0 w-72 flex items-start justify-start gap-2">
                                        <Input
                                            value={localByPersonMap[user.uid]?.toString() || ""}
                                            type="number"
                                            onChange={(e) => handleAmountChange(user.uid, e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="支出金額"
                                        />
                                        <p className="shrink-0 h-9 text-base flex items-center"> + 均分</p>
                                        <p className="shrink-0 w-20 h-9 text-base flex items-center justify-end"> {} 元</p>
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