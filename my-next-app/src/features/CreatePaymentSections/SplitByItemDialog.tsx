import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import Select from "@/components/ui/Select";
import IconButton from "@/components/ui/IconButton";
import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { User, SplitMethod,SplitWay, SplitMap, CreateItemPayload } from "./types";
import { formatNumber,parsePercentToInt,parsePercentToDecimal } from "./utils";
import SplitByItemEdit from "./SplitByItemEditDialog";


interface SplitByItemProps {
    isSplitByItemOpen: boolean;
    onClose: () => void;
    userList: User[];
    inputAmountValue:string;
    splitWay : SplitWay;
    setSplitWay: (value: SplitWay) => void;
    splitByItemMap:SplitMap;
    setSplitByItemMap:(map: SplitMap) => void;

}

export default function SplitByItem({
        isSplitByItemOpen = false,
        onClose,
        userList,
        inputAmountValue,
    }:SplitByItemProps){

    const [itempayload, setItemPayload] = useState<CreateItemPayload>();
    
    // item
    const [step, setStep] = useState<"list" | "singleItem">("list")
    const [isListDetailOpen, setIsListDetailOpen] = useState(false)

    // each item split way 
    const [splitWay, setSplitWay] = useState<SplitWay>("item");
    const [inputItemAmountValue, setInputItemAmountValue] = useState("");



    // render body
    const labelClass = clsx("w-full font-medium truncate")
    const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
    const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
    const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
    

    const renderBody = () => {
        return(
            <>
                {step === 'list' && (
                    <div className="flex flex-col h-full">
                        <div className="w-full flex-1 h-full relative text-zinc-700 overflow-hidden">
                            <div className="text-end">
                                <Button
                                    size='sm'
                                    width='fit'
                                    variant= 'outline'
                                    color= 'primary'
                                    leftIcon="solar:add-circle-bold"
                                    //disabled={isdisabled} 
                                    //isLoading={isLoading}
                                    onClick={()=> setStep('singleItem')}
                                    >
                                        增加項目
                                </Button>
                            </div>  
                            <div className={`pt-2 pb-20 h-full overflow-hidden ${scrollClass}`}>
                                <div className="p-2 rounded-xl hover:bg-sp-green-100">
                                    <div className="flex items-start justify-start gap-2">
                                        <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                            <div  className="shrink-0 flex items-center justify-center ">
                                            <Icon 
                                                icon='solar:delivery-bold'
                                                size='xl'
                                            /> 
                                            </div>
                                            <p className="text-base w-full truncate">產品名稱</p>
                                        </div>
                                        <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                            <Input
                                                value={inputItemAmountValue}
                                                type="number"
                                                onChange={(e) => setInputItemAmountValue(e.target.value)}
                                                flexDirection="row"
                                                width="full"
                                                placeholder="金額"
                                                disabled = {true}
                                            />
                                            <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                            <IconButton
                                                icon={isListDetailOpen ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                                size='sm' 
                                                variant='outline'
                                                color= 'zinc'
                                                //disabled={isdisabled} //根據需求
                                                //isLoading={isLoading} //根據需求
                                                type= 'button'
                                                onClick={() => setIsListDetailOpen(prev => !prev)} 
                                            />
                                            <IconButton
                                                icon='solar:pen-linear'
                                                size='sm' 
                                                variant='outline'
                                                color= 'zinc'
                                                //disabled={isdisabled} //根據需求
                                                //isLoading={isLoading} //根據需求
                                                type= 'button'
                                                onClick={()=> setStep('singleItem')} 
                                            />
                                        </div>
                                    </div>
                                    {isListDetailOpen && (
                                        <div className={`w-full h-fit py-4 px-6 flex flex-col items-start justify-start gap-2 max-h-40 rounded-xl  bg-sp-green-200 overflow-hidden ${scrollClass}`}>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 rounded-xl hover:bg-sp-green-100">
                                    <div className="flex items-start justify-start gap-2">
                                        <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                            <div  className="shrink-0 flex items-center justify-center ">
                                            <Icon 
                                                icon='solar:delivery-bold'
                                                size='xl'
                                            /> 
                                            </div>
                                            <p className="text-base w-full truncate">產品名稱</p>
                                        </div>
                                        <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                            <Input
                                                value={inputItemAmountValue}
                                                type="number"
                                                onChange={(e) => setInputItemAmountValue(e.target.value)}
                                                flexDirection="row"
                                                width="full"
                                                placeholder="金額"
                                                disabled = {true}
                                            />
                                            <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                            <IconButton
                                                icon={isListDetailOpen ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                                size='sm' 
                                                variant='outline'
                                                color= 'zinc'
                                                //disabled={isdisabled} //根據需求
                                                //isLoading={isLoading} //根據需求
                                                type= 'button'
                                                onClick={() => setIsListDetailOpen(prev => !prev)} 
                                            />
                                            <IconButton
                                                icon='solar:pen-linear'
                                                size='sm' 
                                                variant='outline'
                                                color= 'zinc'
                                                //disabled={isdisabled} //根據需求
                                                //isLoading={isLoading} //根據需求
                                                type= 'button'
                                                onClick={()=> setStep('singleItem')} 
                                            />
                                        </div>
                                    </div>
                                    {isListDetailOpen && (
                                        <div className={`w-full h-fit py-4 px-6 flex flex-col items-start justify-start gap-2 max-h-40 rounded-xl  bg-sp-green-200 overflow-hidden ${scrollClass}`}>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 rounded-xl hover:bg-sp-green-100">
                                    <div className="flex items-start justify-start gap-2">
                                        <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                            <div  className="shrink-0 flex items-center justify-center ">
                                            <Icon 
                                                icon='solar:delivery-bold'
                                                size='xl'
                                            /> 
                                            </div>
                                            <p className="text-base w-full truncate">產品名稱</p>
                                        </div>
                                        <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                            <Input
                                                value={inputItemAmountValue}
                                                type="number"
                                                onChange={(e) => setInputItemAmountValue(e.target.value)}
                                                flexDirection="row"
                                                width="full"
                                                placeholder="金額"
                                                disabled = {true}
                                            />
                                            <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                            <IconButton
                                                icon={isListDetailOpen ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                                size='sm' 
                                                variant='outline'
                                                color= 'zinc'
                                                //disabled={isdisabled} //根據需求
                                                //isLoading={isLoading} //根據需求
                                                type= 'button'
                                                onClick={() => setIsListDetailOpen(prev => !prev)} 
                                            />
                                            <IconButton
                                                icon='solar:pen-linear'
                                                size='sm' 
                                                variant='outline'
                                                color= 'zinc'
                                                //disabled={isdisabled} //根據需求
                                                //isLoading={isLoading} //根據需求
                                                type= 'button'
                                                onClick={()=> setStep('singleItem')} 
                                            />
                                        </div>
                                    </div>
                                    {isListDetailOpen && (
                                        <div className={`w-full h-fit py-4 px-6 flex flex-col items-start justify-start gap-2 max-h-40 rounded-xl  bg-sp-green-200 overflow-hidden ${scrollClass}`}>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                            <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                <p className="w-full truncate">用戶名稱</p>
                                                <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 pt-2 w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                            <div className="w-full flex items-start justify-between gap-2 text-base">
                                <p className="wrap-break-word">支出總金額 {} 元</p>
                                <p className="shrink-0">剩餘 {} 元</p>
                            </div>
                            <Button
                                size='sm'
                                width='full'
                                variant= 'solid'
                                color= 'primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                onClick={() => onClose()}
                                >
                                    完成
                            </Button>
                        </div>
                    </div>
                )}
                {step === 'singleItem' && (
                    <SplitByItemEdit
                        userList={userList}
                        step = {step}
                        setStep = {setStep}
                        setItemPayload={setItemPayload}
                    />
                )}
                {/* {step === 'singleItem' && (
                    <div className="relative text-zinc-700">                                
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
                                onChange={handleSplitAmountChange}
                                flexDirection="row"
                                width="full"
                                placeholder="點擊編輯"
                                step="0.01"
                                inputMode="decimal" 
                                />
                            </div>
                        </div>
                        <div className="w-full pb-4 bg-zinc-50 sticky -top-4 z-20">
                            <div id="receipt-way" className=" w-full flex max-w-xl bg-sp-blue-200 rounded-xl">
                                <Button
                                    size='sm'
                                    width='full'
                                    variant= {chooseSplitByItem == 'percentage' ? 'solid' : 'text-button'}
                                    color= 'primary'
                                    //disabled={isdisabled} 
                                    //isLoading={isLoading}
                                    onClick={() => setChooseSplitByItem("percentage")}
                                    >
                                        均分
                                </Button>
                                <Button
                                    size='sm'
                                    width='full'
                                    variant={chooseSplitByItem == 'actual' ? 'solid' : 'text-button'}
                                    color='primary'
                                    //disabled={isdisabled} 
                                    //isLoading={isLoading}
                                    onClick={() => setChooseSplitByItem("actual")}
                                    >
                                        金額
                                </Button>
                                <Button
                                    size='sm'
                                    width='full'
                                    variant={chooseSplitByItem == 'adjusted' ? 'solid' : 'text-button'}
                                    color='primary'
                                    //disabled={isdisabled} 
                                    //isLoading={isLoading}
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
                                                    + {parsePercentToInt(parseFloat((1 / userList.length).toFixed(4)))}% = {formatNumber(entry.total)} 元
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}                         
                    </div>
                )} */}
            </>
        )
    }

    return(
        <Dialog
                header="項目分帳"
                open={isSplitByItemOpen} // 從某處打開
                onClose={ () => {
                    onClose();
                }} // 點擊哪裡關閉
                //headerClassName= {step === "add" ? undefined : "ml-11"}
                bodyClassName= "overflow-hidden"
                footerClassName= "items-center justify-end"
                leftIcon={step === "singleItem" ? "solar:arrow-left-line-duotone" : undefined}
                //hideCloseIcon = false
                //closeOnBackdropClick = false
                onLeftIconClick={()=> setStep('list')}
                // footer= {renderFooter()}
            >
                {renderBody()}
        </Dialog>
    )
}