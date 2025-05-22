import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState } from "react";

interface SplitFunctionProps {
    isSplitFunctionOpen: boolean;
    onClose: () => void;
    userData: {
        avatar?: string;
        name?: string;
    } | null;
}

export default function SplitFunction({
        isSplitFunctionOpen = false,
        onClose,
        userData
    }:SplitFunctionProps){

    const [chooseSplitFunction, setChooseSplitFunction] = useState<"percentage" | "actual" | "adjusted">("percentage");
    const [isPayByUID1, setIsPayByUID1]=useState('')

    const renderFooter = () => {
        return(
            <>
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
            </>
        )
    }

    const splitFunctionDescMap: Record<string, string> = {
        percentage: '每個人依比例分攤',
        actual: '每個人實際支出',
        adjusted: '扣除實際支出後剩餘評分',
      };
      
    const splitFunctionDesc = splitFunctionDescMap[chooseSplitFunction] || '';

    const splitFunctionAmountMap: Record<string, string> = {
        percentage: '目前共計 {}%',
        actual: '目前共計 {}元',
        adjusted: '剩餘 {}元將均分',
      };
      
    const splitFunctionAmount = splitFunctionAmountMap[chooseSplitFunction] || '';
      

    const renderBody = () => {
        return(
            <div className="relative text-zinc-700">
                <div className="w-full pb-2 bg-zinc-50 sticky -top-4 z-20">
                    <div id="receipt-way" className=" w-full flex max-w-xl bg-sp-blue-200 rounded-xl">
                        <Button
                            size='sm'
                            width='full'
                            variant= {chooseSplitFunction == 'percentage' ? 'solid' : 'text-button'}
                            color= 'primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            onClick={() => setChooseSplitFunction("percentage")}
                            >
                                均分
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={chooseSplitFunction == 'actual' ? 'solid' : 'text-button'}
                            color='primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            onClick={() => setChooseSplitFunction("actual")}
                            >
                                金額
                        </Button>
                        <Button
                            size='sm'
                            width='full'
                            variant={chooseSplitFunction == 'adjusted' ? 'solid' : 'text-button'}
                            color='primary'
                            //disabled={isdisabled} 
                            //isLoading={isLoading}
                            onClick={() => setChooseSplitFunction("adjusted")}
                            >
                                特別額
                        </Button>
                    </div>
                    <div className="px-3 py-4 flex items-start justify-between gap-2 text-base">
                        <p className="wrap-break-word">{splitFunctionDesc}</p>
                        <p className="shrink-0">{splitFunctionAmount}</p>
                    </div>
                </div>
                {chooseSplitFunction === 'percentage' && (
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
                {chooseSplitFunction === 'actual' && (
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
                {chooseSplitFunction === 'adjusted' && (
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
        )
    }

    return(
        <Dialog
                header="還款方式"
                open={isSplitFunctionOpen} // 從某處打開
                onClose={ () => {
                    onClose();
                }} // 點擊哪裡關閉
                //headerClassName= {step === "add" ? undefined : "ml-11"}
                bodyClassName= "overflow-hidden"
                footerClassName= "items-center justify-end"
                //leftIcon={step === "add" ? "solar:arrow-left-line-duotone" : undefined}
                //hideCloseIcon = false
                //closeOnBackdropClick = false
                //onLeftIconClick={handleBack}
                footer= {renderFooter()}
            >
                {renderBody()}
        </Dialog>
    )
}