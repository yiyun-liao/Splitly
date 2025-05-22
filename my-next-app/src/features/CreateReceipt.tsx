import clsx from "clsx";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Avatar from "@/components/ui/Avatar";
import ReceiptCard from "./ReceiptListSections/ReceiptCard";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import Select from "@/components/ui/Select";
import { fetchCategoriesForSelect } from "@/lib/categoryApi";
import { solid } from "@cloudinary/url-gen/actions/border";


interface CreateReceiptProps {
    userData: {
      avatar?: string;
      name?: string;
    } | null;
    onClose: () => void;
    open?: boolean;
  }

export default function CreateReceipt({
    userData,
    onClose,
    open = true,
    }:CreateReceiptProps){
        // receipt-way
        const [receiptWay, setReceiptWay] = useState<"pay" | "debt">("pay");
        // receipt-pay
        const [selectCurrencyValue, setSelectedCurrencyValue] = useState("TWD");
        const [inputAmountValue, setInputAmountValue] = useState("");
        const [inputTimeValue, setInputTimeValue] = useState("");
        const [selectCategoryValue, setSelectedCategoryValue] = useState("");
        const [inputItemValue, setInputItemValue] = useState("");
        const [inputDescValue, setInputDescValue] = useState("");
        // receipt-debt
        
        useEffect(() => {
            if (open) document.body.style.overflow = 'hidden';
            else document.body.style.overflow = 'auto';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }, [open]);


        useEffect(()=>{
            if (receiptWay){

            }
        })

        // render category
        const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string; disabled: boolean }[]>([]);
        
        useEffect(() => {
            fetchCategoriesForSelect().then(setCategoryOptions);
        }, []);





        const tokenCount: [number, number] = [inputAmountValue.length, 40];
        const errorMessage = inputAmountValue.length > 40 ? '最多只能輸入 200 字最多只能輸入 200 字' : '';
  
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const headerClass = clsx("min-h-13 py-2 px-4 w-full inline-flex items-center justify-start gap-2")
        const bodyClass = clsx("py-4 px-4 w-full flex-1 overflow-y-auto overflow-x-none", )
        const footerClass = clsx("min-h-13 py-2 px-4 w-full flex gap-1", ) //items-center justify-end
        const labelClass = clsx("w-full font-medium truncate")
        const formSpan1CLass = clsx("col-span-1 flex flex-col gap-2 items-start justify-end")
        const formSpan2CLass = clsx("col-span-2 flex flex-col gap-2 items-start justify-end")
        const formSpan3CLass = clsx("col-span-3 flex flex-col gap-2 items-start justify-end")

        
        return(
            <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50">
                <div className="w-full h-fit pl-17 max-w-520 flex flex-col items-center justify-bottom">
                    <div id="receipt-form" className="w-full h-screen px-6 py-6 rounded-2xl overflow-hidden shadow-md flex flex-col items-start justify-bottom  bg-sp-green-300 text-zinc-700 text-base">
                        <div id="receipt-form-header"  className="w-full max-w-xl flex pt-1 pb-4 items-center gap-2 justify-start overflow-hidden">
                            <IconButton icon='solar:alt-arrow-left-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                            <p className="w-full text-xl font-medium truncate min-w-0"> 新增{receiptWay == 'pay' ? '支出' : '轉帳'}</p>
                            <Button
                                size='sm'
                                width='fit'
                                variant='solid'
                                color='primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                >
                                    儲存
                            </Button>
                        </div>
                        <div id="receipt-way" className="w-full my-4 flex max-w-xl bg-sp-white-20 rounded-xl">
                            <Button
                                size='sm'
                                width='full'
                                variant= {receiptWay == 'pay' ? 'solid' : 'text-button'}
                                color= 'primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                onClick={() => setReceiptWay("pay")}
                                >
                                    支出
                            </Button>
                            <Button
                                size='sm'
                                width='full'
                                variant={receiptWay == 'debt' ? 'solid' : 'text-button'}
                                color='primary'
                                //disabled={isdisabled} 
                                //isLoading={isLoading}
                                onClick={() => setReceiptWay("debt")}
                                >
                                    轉帳
                            </Button>
                        </div>
                        {receiptWay === "pay" && (
                            <section id="receipt-pay"  className={`w-full h-full pb-20 ${scrollClass}`}>
                                <div id="receipt-form-frame" className="max-w-xl w-full grid grid-cols-3 gap-2">
                                    <div className={formSpan1CLass}>
                                        <span className={labelClass}>費用</span>
                                        <Select
                                            value={selectCurrencyValue}
                                            required={true}
                                            placeholder="點擊選擇"
                                            onChange={(e) => setSelectedCurrencyValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            disabled = {true}
                                            options={[
                                                { label: "TWD", value: "TWD" , disabled: true}
                                            ]}
                                        />
                                    </div>
                                    <div className={formSpan2CLass}>
                                        <Input
                                        value={inputAmountValue}
                                        type="number"
                                        onChange={(e) => setInputAmountValue(e.target.value)}
                                        flexDirection="row"
                                        width="full"
                                        placeholder="點擊編輯"
                                        />
                                    </div>
                                    <div className={formSpan1CLass}>
                                        <span className={labelClass}>類別</span>
                                        <Select
                                            value={selectCategoryValue}
                                            required = {true}
                                            onChange={(e) => setSelectedCategoryValue(e.target.value)}
                                            flexDirection= "row"
                                            width= "full"
                                            options={categoryOptions}
                                        />
                                    </div>
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
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>付款人</span>
                                            <Button
                                                size='sm'
                                                width='fit'
                                                variant='text-button'
                                                color='zinc'
                                                //disabled={isdisabled} 
                                                //isLoading={isLoading}
                                                // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                                >
                                                    多位付款人
                                            </Button>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={userData?.avatar}
                                                            userName = {userData?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{userData?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <p className="shrink-0 text-xl font-lg">$489.54805</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>分帳方式</span>
                                            <Button
                                                size='sm'
                                                width='fit'
                                                variant='text-button'
                                                color='zinc'
                                                //disabled={isdisabled} 
                                                //isLoading={isLoading}
                                                // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                                >
                                                    項目分帳
                                            </Button>
                                            <Button
                                                size='sm'
                                                width='fit'
                                                variant='solid'
                                                color='primary'
                                                //disabled={isdisabled} 
                                                //isLoading={isLoading}
                                                // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                                >
                                                    成員分帳
                                            </Button>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={userData?.avatar}
                                                            userName = {userData?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{userData?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <p className="shrink-0 text-xl font-lg">$489.54805</p>
                                                    <div className="p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">均分</div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={userData?.avatar}
                                                            userName = {userData?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{userData?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <p className="shrink-0 text-xl font-lg">$489.54805</p>
                                                    <div className="p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">均分</div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={userData?.avatar}
                                                            userName = {userData?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{userData?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <p className="shrink-0 text-xl font-lg">$489.54805</p>
                                                    <div className="p-1 rounded-sm bg-sp-blue-300 text-sp-blue-500">均分</div>
                                                </div>
                                            </div>                                                                                
                                        </div>
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>時間</span>
                                        <Input
                                            value={inputTimeValue}
                                            type="datetime-local"
                                            onChange={(e) => setInputTimeValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊選擇"
                                        />
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>備忘錄</span>
                                        <TextArea
                                            value={inputDescValue}
                                            rows={2}
                                            maxRows={4}
                                            required={true}
                                            onChange={(e) => setInputDescValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊編輯"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                        {receiptWay === "debt" && (
                            <section id="receipt-debt"  className={`w-full h-full pb-20 ${scrollClass}`}>
                                <div id="receipt-form-frame" className="max-w-xl w-full grid grid-cols-3 gap-2">
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>匯款人</span>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={userData?.avatar}
                                                            userName = {userData?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{userData?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <Button
                                                        size='sm'
                                                        width='fit'
                                                        variant='text-button'
                                                        color='zinc'
                                                        //disabled={isdisabled} 
                                                        //isLoading={isLoading}
                                                        // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                                        >
                                                            其他人
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={formSpan1CLass}>
                                        <span className={labelClass}>費用</span>
                                        <Select
                                            value={selectCurrencyValue}
                                            required={true}
                                            placeholder="點擊選擇"
                                            onChange={(e) => setSelectedCurrencyValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            disabled = {true}
                                            options={[
                                                { label: "TWD", value: "TWD" , disabled: true}
                                            ]}
                                        />
                                    </div>
                                    <div className={formSpan2CLass}>
                                        <Input
                                        value={inputAmountValue}
                                        type="number"
                                        onChange={(e) => setInputAmountValue(e.target.value)}
                                        flexDirection="row"
                                        width="full"
                                        placeholder="點擊編輯"
                                        />
                                    </div>
                                    <div className={`pb-5 ${formSpan3CLass}`}>
                                        <div className="w-full flex items-center justify-start gap-2">
                                            <span className={labelClass}>匯款人</span>
                                        </div>
                                        <div className={`w-full h-fit max-h-60 rounded-2xl bg-sp-white-20 overflow-hidden ${scrollClass}`}>
                                            <div className="px-3 py-3 flex items-center justify-start gap-2">
                                                <div className="w-full flex items-center justify-start gap-2 overflow-hidden">
                                                    <div className="shrink-0  flex items-center justify-center ">
                                                        <Avatar
                                                            size="md"
                                                            img={userData?.avatar}
                                                            userName = {userData?.name}
                                                        />
                                                    </div>
                                                    <p className="text-base truncate">{userData?.name}</p>
                                                </div>
                                                <div  className="shrink-0 flex items-center justify-start gap-2 overflow-hidden">
                                                    <Button
                                                        size='sm'
                                                        width='fit'
                                                        variant='text-button'
                                                        color='zinc'
                                                        //disabled={isdisabled} 
                                                        //isLoading={isLoading}
                                                        // onClick={()=> setIsSelfExpenseDialogOpen(true)}
                                                        >
                                                            其他人
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>時間</span>
                                        <Input
                                            value={inputTimeValue}
                                            type="datetime-local"
                                            onChange={(e) => setInputTimeValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊選擇"
                                        />
                                    </div>
                                    <div className={formSpan3CLass}>
                                        <span className={labelClass}>備忘錄</span>
                                        <TextArea
                                            value={inputDescValue}
                                            rows={2}
                                            maxRows={4}
                                            required={true}
                                            onChange={(e) => setInputDescValue(e.target.value)}
                                            flexDirection="row"
                                            width="full"
                                            placeholder="點擊編輯"
                                        />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        )
}