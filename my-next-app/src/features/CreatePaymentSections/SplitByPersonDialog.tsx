import { useState} from "react";
import { SplitMap, SplitMethod,SplitWay } from "@/types/payment";
import clsx from "clsx";

import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import ModalPortal from "@/components/ui/ModalPortal";

import { UserData } from "@/types/user";
import { useSplitPercentageMap } from "./hooks/useSplitPercentageMap";
import { useSplitActualMap } from "./hooks/useSplitActualMap";
import { useSplitAdjustedMap } from "./hooks/useSplitAdjustMap";
import { formatPercent } from "@/utils/parseNumber";
import { useIsMobile } from "@/hooks/useIsMobile";

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

    const [localChooseSplitByPerson, setLocalChooseSplitByPerson] = useState<SplitMethod>(chooseSplitByPerson);
    const isMobile = useIsMobile();
    // console.log("預設人分帳資料", splitByPersonMap)

    const percentageHook = useSplitPercentageMap({
        currentProjectUsers,
        inputAmountValue,
        initialMap: splitByPersonMap,
    });
    
    const actualHook = useSplitActualMap({
        currentProjectUsers,
        inputAmountValue,
        initialMap: splitByPersonMap,
    });
    
    const adjustedHook = useSplitAdjustedMap({
        currentProjectUsers,
        inputAmountValue,
        initialMap: splitByPersonMap,
    });
    
    const activeHook =
        localChooseSplitByPerson === "percentage" ? percentageHook
        : localChooseSplitByPerson === "actual" ? actualHook
        : adjustedHook;

    const { localMap, rawInputMap, handleChange, computeFooterInfo, generateFinalMap } = activeHook;


    const remainingClass = clsx("shrink-0 w-fit text-end", {
        "text-red-500": !computeFooterInfo.isComplete,
    });
    
    const splitByPersonDescMap: Record<string, string> = {
        percentage: "每個人依比例分攤",
        actual: "每個人實際支出",
        adjusted: "扣除實際支出後剩餘均分",
    };
    const splitByPersonTotalMap: Record<string, string> = {
        percentage: "/ 共計 100%",
        actual: `/ 共計 ${inputAmountValue} 元`,
        adjusted: `/ 共計 ${inputAmountValue} 元`,
    };

    // console.log("[person] payloadList", JSON.stringify(generateFinalMap(), null, 2));

    const renderFooter = () => {
        return(
            <div className="w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                <div className="w-full flex items-center justify-end gap-4 text-base">
                    <p className={remainingClass}>{computeFooterInfo.infoText}</p>
                    <p className="shrink-0 w-fit text-end text-sm">{splitByPersonTotalMap[localChooseSplitByPerson]}</p>
                </div>
                <Button
                    size='sm'
                    width='full'
                    variant= 'solid'
                    color= 'primary'
                    disabled={!computeFooterInfo.isComplete}
                    onClick={() => {
                        setChooseSplitByPerson(localChooseSplitByPerson)
                        setSplitByPersonMap(generateFinalMap())
                        // console.log("最終分帳方式", generateFinalMap())
                        setSplitWay("person")
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
                <div className="w-full pb-4 bg-zinc-50 sticky -top-4 z-12">
                    <div id="receipt-way" className=" w-full flex bg-sp-blue-200 rounded-xl">
                        {["percentage", "actual", "adjusted"].map(method => (
                            <Button
                                key={method}
                                size="sm"
                                width="full"
                                variant={localChooseSplitByPerson === method ? "solid" : "text-button"}
                                color="primary"
                                onClick={() => setLocalChooseSplitByPerson(method as SplitMethod)}
                            >
                                {method === "percentage" ? "均分" : method === "actual" ? "金額" : "特別額"}
                            </Button>
                        ))}
                    </div>
                    <p className="wrap-break-word py-2 px-2 text-sp-blue-500">{splitByPersonDescMap[localChooseSplitByPerson]}</p>
                </div>
                <div className="pt-2">
                    {currentProjectUsers.map(user => {
                        const entry = localMap[user.uid] ?? { fixed: 0, percent: 0, total: 0 };

                        return (
                        <div key={user.uid} className={`px-3 pb-2 flex items-start gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                            <div className={`min-h-9 w-full flex items-center gap-2 overflow-hidden`}>
                                <div className="shrink-0">
                                    <Avatar size="md" img={user.avatarURL} userName={user.name} />
                                </div>
                                <p className="text-base w-full truncate">{user.name}</p>
                            </div>
                            <div className="shrink-0 min-w-60 w-full flex flex-col items-end pb-3">
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
                                    <p className="shrink-0 h-9 text-base flex items-center">{localChooseSplitByPerson === "percentage" ? "%" : "元"}</p>
                                </div>
                                <p className="shrink-0 w-full mt-[-24px] text-sm flex justify-end text-zinc-500">
                                   {localChooseSplitByPerson === 'adjusted' ? `+ ${formatPercent(1/currentProjectUsers.length)} = ${entry.total.toFixed(2)} 元`  : `= ${entry.total.toFixed(2)} 元`}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                    </div>
            </div>
        )
    }

    return(
        <ModalPortal>
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
        </ModalPortal>
    )
}