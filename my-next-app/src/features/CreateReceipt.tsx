import clsx from "clsx";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Avatar from "@/components/ui/Avatar";
import ReceiptCard from "./ExpenseOverviewSections/ReceiptCard";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/textArea";
import Select from "@/components/ui/Select";

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
        const [inputAmountValue, setInputAmountValue] = useState("");
        const [inputTimeValue, setInputTimeValue] = useState("");
        const [inputCategoryValue, setInputCategoryValue] = useState("");
        const [inputDescValue, setInputDescValue] = useState("");

    
        useEffect(() => {
            if (open) document.body.style.overflow = 'hidden';
            else document.body.style.overflow = 'auto';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }, [open]);
        
        if (!open) return null;

        const tokenCount: [number, number] = [inputAmountValue.length, 40];
        const errorMessage = inputAmountValue.length > 40 ? '最多只能輸入 200 字最多只能輸入 200 字' : '';
  
        const scrollClass = clsx("overflow-y-auto overflow-x-hidden scrollbar-gutter-stable scrollbar-thin scroll-smooth")
        const headerClass = clsx("min-h-13 py-2 px-4 w-full inline-flex items-center justify-start gap-2")
        const bodyClass = clsx("py-4 px-4 w-full flex-1 overflow-y-auto overflow-x-none", )
        const footerClass = clsx("min-h-13 py-2 px-4 w-full flex gap-1", ) //items-center justify-end
        
        return(
            <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50">
                <div className="w-full h-fit pl-17 max-w-520 flex flex-col items-center justify-bottom">
                    <div className="w-full h-screen bg-sp-blue-100 rounded-2xl overflow-hidden shadow-md flex flex-col items-center justify-bottom">
                        <div id="receipt-form" className="shrink-0 w-full px-3 py-3 h-full overflow-hidden bg-sp-green-300 text-zinc-700">
                            <div id="receipt-form-header"  className="py-2 px-4 flex items-center gap-2 w-full justify-between overflow-hidden">
                                <p className="text-xl font-medium whitespace-nowrap truncate min-w-0 max-w-100"> 新增支出</p>
                                <IconButton icon='solar:close-circle-line-duotone' size="sm" variant="text-button" color="zinc" type="button" onClick={onClose} />
                            </div>
                            <div id="receipt-form-frame" className={`max-w-xl py-2 px-4 h-full flex flex-col items-start justify-start gap-2 ${scrollClass}`}>
                                <Input
                                    label= "金額"
                                    value= {inputAmountValue}
                                    type="number"
                                    onChange={(e) => setInputAmountValue(e.target.value)} //看需求
                                    flexDirection = 'row'
                                    //labelClassName= string //看需求
                                    //inputClassName= string //看需求
                                    width= 'full'
                                    //leftIcon= "solar:pen-line-duotone"
                                    placeholder= "支出金額"
                                    //isLoading= {isLoading}
                                    //tokenMaxCount={tokenCount}
                                    //errorMessage={errorMessage}
                                    //disabled = {isDisabled}
                                /> 
                                <Select
                                    label="類別"
                                    value={inputCategoryValue}
                                    required = {true}
                                    placeholder = "請選擇"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    flexDirection= "row"
                                    //labelClassName= "string";
                                    //selectClassName= "string";
                                    width= "full"
                                    //leftIcon="solar:document-bold-duotone"
                                    //isLoading= {true}
                                    //disabled={false}
                                    //errorMessage={errorMessage}
                                    options={[
                                        { label: "工作", value: "work" },
                                        { label: "生活", value: "life" },
                                        { label: "娛樂", value: "entertainment" },
                                    ]}
                                />
                                <Input // dropdown
                                    label= "名稱"
                                    value= {inputCategoryValue}
                                    type="text"
                                    onChange={(e) => setInputCategoryValue(e.target.value)} //看需求
                                    flexDirection = 'row'
                                    //labelClassName= string //看需求
                                    //inputClassName= string //看需求
                                    width= 'full'
                                    //leftIcon= "solar:pen-line-duotone"
                                    placeholder= "支出內容"
                                    //isLoading= {true}
                                    //tokenMaxCount={tokenCount}
                                    //errorMessage={errorMessage}
                                    //disabled = {isDisabled}
                                />     
                                <Input
                                    label= "時間"
                                    value= {inputTimeValue}
                                    type="datetime-local"
                                    onChange={(e) => setInputTimeValue(e.target.value)} //看需求
                                    flexDirection = 'row'
                                    //labelClassName= string //看需求
                                    //inputClassName= string //看需求
                                    width= 'full'
                                    //leftIcon= "solar:pen-line-duotone"
                                    placeholder= "支出時間"
                                    //isLoading= {isLoading}
                                    //tokenMaxCount={tokenCount}
                                    //errorMessage={errorMessage}
                                    //disabled = {isDisabled}
                                />  
                                 <TextArea
                                    label= "標題名稱"
                                    value= {inputDescValue}
                                    rows = {2}
                                    maxRows={4}
                                    required = {true}
                                    onChange={(e) => setInputDescValue(e.target.value)} //看需求
                                    flexDirection = 'row'
                                    //labelClassName= string //看需求
                                    //textAreaClassName= string //看需求
                                    width= 'full'
                                    //leftIcon= "solar:pen-line-duotone"
                                    placeholder= "細節說明"
                                    //isLoading= {true}
                                    //tokenMaxCount={tokenCount}
                                    //errorMessage={errorMessage}
                                    //disabled = {isDisabled}
                                />                         
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}