import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { SplitWay, SplitMap, CreateItemPayload } from "../../types/payment";
import { formatNumber } from "./utils";
import SplitByItemEdit from "./SplitByItemEditDialog";
import { UserData } from "@/types/user";


interface SplitByItemProps {
    isSplitByItemOpen: boolean;
    onClose: () => void;
    currentProjectUsers: UserData[];
    inputAmountValue:string;
    setSplitByItemMap:(map: SplitMap) => void;
    itemPayloadList:CreateItemPayload[];
    setItemPayloadList:(map:CreateItemPayload[]) => void;
    setSplitWay:(map:SplitWay) => void;
}

export default function SplitByItem({
        isSplitByItemOpen = false,
        onClose,
        currentProjectUsers,
        inputAmountValue,
        setSplitByItemMap,
        itemPayloadList,
        setItemPayloadList,
        setSplitWay
    }:SplitByItemProps){
    
    // item
    const [step, setStep] = useState<"list" | "singleItem">("list")
    const [openDetailIndex, setOpenDetailIndex] = useState<number | null>(null);
    const [openSampleDetail, setOpenSampleDetail] = useState(false);

    // save all item
    const [itemList, setItemList] = useState<CreateItemPayload[]>([]);

    // update single item, get itemList index
    const [editItemIndex, setEditItemIndex] = useState<number | null>(null);


    // reopen the item dialog to update data
    useEffect(() => {
        if (isSplitByItemOpen) {
            setItemList(itemPayloadList);
        }
    }, [isSplitByItemOpen, itemPayloadList]);    
    

    // render footer
    const {remaining, isComplete } = useMemo(() => {
        const targetAmount = parseFloat(inputAmountValue || "0");
        let isComplete = false;
        const currentAmount = Object.values(itemList).reduce((sum, entry) => sum + (entry.amount || 0),0)
        const remaining = targetAmount - currentAmount
        isComplete = remaining === 0
        console.log(itemList)
    
        return { remaining, isComplete };
    }, [inputAmountValue, itemList]);  

    const remainingClass = clsx('shrink-0',
        {
        'text-red-500' : !isComplete,
        }
    )
    // get data
    const updateSplitByItemMapFromItemList = () => {
        const tempMap: SplitMap = Object.fromEntries(
            currentProjectUsers.map(user => [
            user.uid,
            { fixed: 0, percent: 0, total: 0 }
            ])
        );      
        // 累加每筆 item 的付款資訊
        itemList.forEach(item => {
            Object.entries(item.split_map ?? {}).forEach(([uid, entry]) => {
                    
            // 每個人累加自己的金額（覆寫而非疊加）
            tempMap[uid].fixed = (tempMap[uid].fixed || 0) + (entry.total|| 0);
            tempMap[uid].total = (tempMap[uid].total || 0) + (entry.total || 0);
            });
        });
      
        // 過濾出 total > 0 的人
        const filteredMap: SplitMap = Object.fromEntries(
          Object.entries(tempMap).filter(([_, entry]) => entry.total > 0)
        );
      
        return filteredMap;
    };
      

    // render body
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
                                    onClick={()=> setStep('singleItem')}
                                    >
                                        增加項目
                                </Button>
                            </div> 
                            <div className={`pt-2 pb-20 h-full overflow-hidden ${scrollClass}`}>
                                { itemList.length === 0 &&                                
                                    <div className="p-2 rounded-xl  hover:bg-sp-green-100  opacity-80 bg-sp-green-200">
                                        <div className="flex items-start justify-start gap-2 pb-2">
                                            <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                                <div  className="shrink-0 flex items-center justify-center ">
                                                <Icon 
                                                    icon='solar:delivery-bold'
                                                    size='xl'
                                                /> 
                                                </div>
                                                <p className="text-base w-full line-clamp-2 overflow-hidden text-ellipsis break-words">範例。點擊右上角新增！</p>
                                            </div>
                                            <div  className="shrink-0 w-50 flex items-start justify-start gap-2">
                                                <p className="h-9 w-full text-base flex items-center justify-end"> 100 元</p>
                                                <IconButton
                                                    icon={openSampleDetail ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                                    size='sm' 
                                                    variant='outline'
                                                    color= 'zinc'
                                                    type= 'button'
                                                    onClick={() => setOpenSampleDetail(prev => !prev)} 
                                                />
                                                <IconButton
                                                    icon='solar:pen-linear'
                                                    size='sm' 
                                                    variant='outline'
                                                    color= 'zinc'
                                                    type= 'button'
                                                    onClick={()=> {}} 
                                                />
                                            </div>
                                        </div>
                                        {openSampleDetail && (
                                            <div className={`w-full h-fit py-4 px-6 flex flex-col items-start justify-start gap-2 max-h-40 rounded-xl  bg-sp-green-200 overflow-hidden ${scrollClass}`}>
                                                <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                    <p className="w-full truncate">小貓</p>
                                                    <p className="shrink-0 w-40 font-semibold text-sp-green-500 text-end"> 40 元</p>
                                                </div>
                                                <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                    <p className="w-full truncate">小狗</p>
                                                    <p className="shrink-0 w-40 font-semibold text-sp-green-500 text-end"> 20 元</p>
                                                </div>
                                                <div className="w-full text-base flex items-bottom justify-end gap-4">
                                                    <p className="w-full truncate">小豬</p>
                                                    <p className="shrink-0 w-40 font-semibold text-sp-green-500 text-end"> 40 元</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                                {itemList.map((item, index) => {
                                    const isOpen = openDetailIndex === index;
                                    return(                                        
                                        <div key={index} className="p-2 rounded-xl hover:bg-sp-green-100">
                                            <div className="flex items-start justify-start gap-2 pb-2">
                                                <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div  className="shrink-0 flex items-center justify-center ">
                                                    <Icon 
                                                        icon='solar:delivery-bold'
                                                        size='xl'
                                                    /> 
                                                    </div>
                                                    <p className="text-base w-full line-clamp-2 overflow-hidden text-ellipsis break-words">{item.payment_name}</p>
                                                </div>
                                                <div  className="shrink-0 w-50 flex items-start justify-start gap-2">
                                                    <p className="h-9 w-full text-base flex items-center justify-end">{formatNumber(item.amount)} 元</p>
                                                    <IconButton
                                                        icon={isOpen ? 'solar:alt-arrow-up-outline' : 'solar:alt-arrow-down-outline'}
                                                        size='sm' 
                                                        variant='outline'
                                                        color= 'zinc'
                                                        type= 'button'
                                                        onClick={() => {setOpenDetailIndex(isOpen ? null : index);}} 
                                                    />
                                                    <IconButton
                                                        icon='solar:pen-linear'
                                                        size='sm' 
                                                        variant='outline'
                                                        color= 'zinc'
                                                        type= 'button'
                                                        onClick={()=> {
                                                            console.log(itemList[index])
                                                            setEditItemIndex(index);
                                                            setStep('singleItem');
                                                        }} 
                                                    />
                                                </div>
                                            </div>
                                            {isOpen && (
                                                <div className={`w-full h-fit py-4 px-6 flex flex-col items-start justify-start gap-2 max-h-40 rounded-xl  bg-sp-green-200 overflow-hidden ${scrollClass}`}>
                                                    {Object.entries(item.split_map).map(([uid, detail]) => {
                                                        const user = currentProjectUsers.find(user => user.uid === uid);
                                                        const name = user?.name ?? "";
                                                        return(
                                                            <div key={uid} className="w-full text-base flex items-bottom justify-end gap-4">
                                                                <p className="w-full truncate">{name}</p>
                                                                <p className="shrink-0 w-40 font-semibold text-sp-green-500 text-end">{formatNumber(detail.total)} 元</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div> 
                        </div>
                        <div className="shrink-0 pt-2 w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
                            <div className="w-full flex items-start justify-between gap-2 text-base">
                                <p className="wrap-break-word">支出總金額 {inputAmountValue} 元</p>
                                <p className={remainingClass}>剩餘 {formatNumber(remaining)} 元</p>
                            </div>
                            <Button
                                size='sm'
                                width='full'
                                variant= 'solid'
                                color= 'primary'
                                disabled={!isComplete} 
                                onClick={() => {
                                    setSplitByItemMap(updateSplitByItemMapFromItemList());
                                    setItemPayloadList(itemList);  
                                    console.log("項目分帳", updateSplitByItemMapFromItemList(), itemList)
                                    setSplitWay("item")                                  
                                    onClose()
                                }}
                                >
                                    完成
                            </Button>
                        </div>
                    </div>
                )}
                {step === 'singleItem' && (
                    <SplitByItemEdit
                        currentProjectUsers={currentProjectUsers}
                        setStep = {setStep}
                        initialPayload={editItemIndex !== null ? itemList[editItemIndex] : undefined}
                        setItemPayload={(payload) => {
                            if (editItemIndex !== null) {
                                setItemList((prev) => {
                                  const updated = [...prev];
                                  updated[editItemIndex] = payload;
                                  return updated;
                                });
                                setEditItemIndex(null); 
                              } else {
                                setItemList((prev) => [...prev, payload]);
                              }                              
                        }}
                        onDeleteItem={() => {
                            if (editItemIndex !== null) {
                              setItemList((prev) => prev.filter((_, i) => i !== editItemIndex));
                              setEditItemIndex(null);
                            }
                        }}
                    />
                )}
            </>
        )
    }

    return(
        <Dialog
                header="項目分帳"
                open={isSplitByItemOpen} 
                onClose={ () => {
                    onClose();
                }} 
                bodyClassName= "overflow-hidden"
                leftIcon={step === "singleItem" ? "solar:arrow-left-line-duotone" : undefined}
                onLeftIconClick={()=> {
                    setEditItemIndex(null); 
                    setStep('list');
                }}
            >
                {renderBody()}
        </Dialog>
    )
}