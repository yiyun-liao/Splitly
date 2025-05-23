import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Icon from "@/components/ui/Icon";
import IconButton from "@/components/ui/IconButton";
import { useState } from "react";

interface SplitByItemProps {
    isSplitByItemOpen: boolean;
    onClose: () => void;
    userData: {
        avatar?: string;
        name?: string;
    } | null;
}

export default function SplitByItem({
        isSplitByItemOpen = false,
        onClose,
        userData
    }:SplitByItemProps){
    // item
    const [step, setStep] = useState<"list" | "singleItem">("list")
    const [isListDetailOpen, setIsListDetailOpen] = useState(false)

    // each item split way 
    const [chooseSplitByItem, setChooseSplitByItem] = useState<"percentage" | "actual" | "adjusted">("percentage");
    const [isPayByUID1, setIsPayByUID1]=useState('')

    const renderFooter = () => {
        return(
            <div className="w-full flex flex-col items-start justify-start gap-2 text-base  text-zinc-700">
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
        )
    }

      

    const renderBody = () => {
        return(
            <>
                {step === 'list' && (
                    <div className="relative text-zinc-700">
                        <div className="w-full pb-4 bg-zinc-50 sticky -top-4 z-20">
                        </div>
                        <div className="pt-2">
                            <div>
                                <div className="flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                        <Icon 
                                            icon='solar:delivery-bold'
                                            size='xl'
                                            // className="text-red-500" //根據需求
                                        /> 
                                        </div>
                                        <p className="text-base w-full truncate">產品名稱</p>
                                    </div>
                                    <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                        <Input
                                            value={isPayByUID1}
                                            type="number"
                                            onChange={(e) => setIsPayByUID1(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="金額"
                                            disabled = {true}
                                        />
                                        <p className="shrink-0 h-9 text-base flex items-center">元</p>
                                        <IconButton
                                            icon={isListDetailOpen ? 'solar:alt-arrow-down-outline' : 'solar:alt-arrow-up-outline'}
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
                                            //</div>onClick={()=> setIsListDetailOpen(true)} 
                                        />
                                    </div>
                                </div>
                                {isListDetailOpen && (
                                    <div className="p-2 flex flex-col items-start justify-start gap-2 bg-sp-green-200 rounded-xl">
                                        <div className="w-full text-base flex items-bottom justify-end gap-4">
                                            <p className="">用戶名稱</p>
                                            <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                        </div>
                                        <div className="w-full text-base flex items-bottom justify-end gap-4">
                                            <p className="">用戶名稱</p>
                                            <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                        </div>
                                        <div className="w-full text-base flex items-bottom justify-end gap-4">
                                            <p className="">用戶名稱</p>
                                            <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                        </div>
                                        <div className="w-full text-base flex items-bottom justify-end gap-4">
                                            <p className="">用戶名稱</p>
                                            <p className="shrink-0 w-40 text-sp-green-500 text-end">543元</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>         
                    </div>
                )}
                {step === 'singleItem' && (
                    <div className="relative text-zinc-700">
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
                        </div>
                        {chooseSplitByItem === 'percentage' && (
                            <div className="pt-2">
                                <div className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={userData?.avatar}
                                                userName = {userData?.name}
                                            />
                                        </div>
                                        <p className="text-base w-full truncate">{userData?.name}</p>
                                    </div>
                                    <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                        <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                        <Input
                                            value={isPayByUID1}
                                            type="number"
                                            onChange={(e) => setIsPayByUID1(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="支出比例"
                                        />
                                    <p className="shrink-0 h-9 text-base flex items-center">%</p>

                                    </div>
                                </div>
                            </div>
                        )}
                        {chooseSplitByItem === 'actual' && (
                            <div className="pt-2">
                                <div className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={userData?.avatar}
                                                userName = {userData?.name}
                                            />
                                        </div>
                                        <p className="text-base w-full truncate">{userData?.name}</p>
                                    </div>
                                    <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                        <p className="shrink-0 h-9 text-base flex items-center">支出</p>
                                        <Input
                                            value={isPayByUID1}
                                            type="number"
                                            onChange={(e) => setIsPayByUID1(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="支出金額"
                                        />
                                    <p className="shrink-0 h-9 text-base flex items-center">元</p>

                                    </div>
                                </div>
                            </div>
                        )}
                        {chooseSplitByItem === 'adjusted' && (
                            <div className="pt-2">
                                <div className="px-3 pb-2 flex items-start justify-start gap-2">
                                    <div className="min-h-9 w-full flex items-center justify-start gap-2 overflow-hidden">
                                        <div  className="shrink-0 flex items-center justify-center ">
                                            <Avatar
                                                size="md"
                                                img={userData?.avatar}
                                                userName = {userData?.name}
                                            />
                                        </div>
                                        <p className="text-base w-full truncate">{userData?.name}</p>
                                    </div>
                                    <div  className="shrink-0 w-60 flex items-start justify-start gap-2">
                                        <p className="shrink-0 h-9 text-base flex items-center">另外支出</p>
                                        <Input
                                            value={isPayByUID1}
                                            type="number"
                                            onChange={(e) => setIsPayByUID1(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="支出金額"
                                        />
                                    <p className="shrink-0 h-9 text-base flex items-center">元</p>

                                    </div>
                                </div>
                            </div>
                        )}                
                    </div>
                )}
            </>
        )
    }

    return(
        <Dialog
                header="還款方式"
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
                //onLeftIconClick={handleBack}
                footer= {renderFooter()}
            >
                {renderBody()}
        </Dialog>
    )
}