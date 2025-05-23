import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState } from "react";

interface SplitByPersonProps {
    isSplitByPersonOpen: boolean;
    onClose: () => void;
    userData: {
        avatar?: string;
        name?: string;
    } | null;
}

export default function SplitByPerson({
        isSplitByPersonOpen = false,
        onClose,
        userData
    }:SplitByPersonProps){

    const [chooseSplitByPerson, setChooseSplitByPerson] = useState<"percentage" | "actual" | "adjusted">("percentage");
    const [isPayByUID1, setIsPayByUID1]=useState('')

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
                    //isLoading={isLoading}
                    onClick={() => onClose()}
                    >
                        完成
                </Button>
            </div>
        )
    }

    const splitByPersonDescMap: Record<string, string> = {
        percentage: '每個人依比例分攤',
        actual: '每個人實際支出',
        adjusted: '扣除實際支出後剩餘均分',
      };
      
    const splitByPersonDesc = splitByPersonDescMap[chooseSplitByPerson] || '';

    const splitByPersonAmountMap: Record<string, string> = {
        percentage: '目前共計 {}%',
        actual: '目前共計 {}元',
        adjusted: '剩餘 {}元將均分',
      };
      
    const splitByPersonAmount = splitByPersonAmountMap[chooseSplitByPerson] || '';
      

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
                {chooseSplitByPerson === 'actual' && (
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
                {chooseSplitByPerson === 'adjusted' && (
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
                open={isSplitByPersonOpen} // 從某處打開
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