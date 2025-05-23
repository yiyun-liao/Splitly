import Dialog from "@/components/ui/Dialog";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import { useState } from "react";

interface PayerFunctionProps {
    isPayerFunctionOpen: boolean;
    onClose: () => void;
    userData: {
        avatar?: string;
        name?: string;
    } | null;
}

export default function PayerFunction({
        isPayerFunctionOpen = false,
        onClose,
        userData
    }:PayerFunctionProps){
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
            <div>
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
                    </div>
                </div>
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
                    </div>
                </div>
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
                    </div>
                </div>
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
                    </div>
                </div>
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
                    </div>
                </div>
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
                    </div>
                </div>
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
                    </div>
                </div>
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
                    </div>
                </div>
            </div>
        )
    }

    return(
        <Dialog
                header="付款人"
                open={isPayerFunctionOpen} // 從某處打開
                onClose={ () => {
                    onClose();
                }} // 點擊哪裡關閉
                //headerClassName= {step === "add" ? undefined : "ml-11"}
                // bodyClassName= string // 看需求
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