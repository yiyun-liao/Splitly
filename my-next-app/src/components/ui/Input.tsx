import { useRef, useState } from "react";
import Icon from "./Icon"
import clsx from 'clsx';


interface InputProps  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    value?: string;
    type?:string;
    required?:boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    flexDirection? : 'row' | 'col';
    labelClassName?: string;
    inputClassName?: string;
    width?: 'full' | 'fit';
    leftIcon?: string;
    placeholder?: string;
    isLoading?: boolean;
    disabled?: boolean;
    tokenMaxCount?: [current: number, max: number] | undefined;
    errorMessage?: string;
}

export default function Input({
        label,
        value,
        type = 'text',
        required = false,
        onChange,
        flexDirection = 'row',
        labelClassName,
        inputClassName,
        width = 'fit',
        leftIcon,
        placeholder,
        isLoading = false,
        disabled = false, 
        tokenMaxCount,
        errorMessage, 
    ...props}:InputProps){

    const inputRef = useRef<HTMLInputElement>(null);

    // 清空 input 內容
    const handleClear = () => {
        onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        inputRef.current?.focus();
    };

    const isInputError = () => {
        if (errorMessage) return true;
        if (tokenMaxCount && typeof tokenMaxCount[1] === 'number' && tokenMaxCount[0] > tokenMaxCount[1] ) return true;
        return false;
    };
      
    const hasError = isInputError();

    const inputFrameClass = clsx(
        "flex cursor-pointer items-start justify-start min-w-20",
        {
          "flex-row gap-2": flexDirection === "row",
          "flex-col gap-1": flexDirection === "col",
          "w-full": width === "full",
          "w-fit": width === "fit",
        }
    );

    const wrapperClass = clsx(
        "px-3 py-2 max-h-9 text-base ring-1 stroke-inherit rounded-xl tracking-widest flex items-center justify-start",
        {
          "bg-zinc-200 text-zinc-400 ring-zinc-200 cursor-not-allowed": disabled || isLoading,
          "cursor-pointer text-zinc-700 bg-zinc-50 hover:text-zinc-700 active:text-zinc-900": !disabled && !isLoading,
          "ring-red-400 hover:ring-red-400 active:ring-red-400 focus-within:ring-red-500 focus-within:border-red-500": hasError,
          "ring-zinc-400 hover:ring-zinc-700 active:ring-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900": !hasError && !disabled && !isLoading,
        }
    );
    
    const labelClasses = clsx( "w-full min-h-9 text-wrap flex items-center justify-start",labelClassName);
    const inputItemClass = clsx("w-full wrap-anywhere", inputClassName);
    const inputClasses = 'w-full stroke-none outline-none';
    const helperClasses = 'flex items-start justify-end gap-1 w-full text-sm my-1 min-h-5 transition-all duration-200 ';
    const errorMessageClasses = 'text-red-400 break-words w-full ';

    const tokenCountClasses = clsx("text-wrap flex-shrink-0", {
        "text-zinc-400": disabled,
        "text-red-400 font-semibold": tokenMaxCount && tokenMaxCount[0] > tokenMaxCount[1],
    });


    const leftIconNode = leftIcon ? <Icon icon={leftIcon} size="md" className="mr-2" /> : null;

    const currentValue = !!value && value?.length > 0
    const rightIconNode = !currentValue  ?
        null : !disabled && !isLoading && value ? (
            <button type="button" onClick={handleClear} className="ml-2 hover:text-sp-blue-500 cursor-pointer">
                <Icon icon="solar:close-circle-line-duotone" size="lg" />
            </button>
        ) : isLoading ? (
            <div className="ml-2">
                <Icon icon="solar:spinner" size="lg" className="animate-spin" />
            </div>
        )  : null;
    

    return (
      <div className={inputFrameClass}>
            {label && <label className={labelClasses}>{label}</label>}
            <div className={inputItemClass}>
                <div className={wrapperClass}>
                    {leftIconNode}
                    <input
                        ref={inputRef} 
                        type={type}
                        value={value ?? ""}
                        required={required}
                        className={inputClasses} 
                        placeholder={placeholder} 
                        disabled={disabled || isLoading} 
                        onChange={onChange}
                        {...props}/>
                    {rightIconNode}
                </div>
                <div className={helperClasses}>
                    {errorMessage && <p className={errorMessageClasses}>{errorMessage}</p>}
                    {tokenMaxCount && <p className={tokenCountClasses}>{tokenMaxCount[0]}/{tokenMaxCount[1]}</p>}
                </div>                
            </div>
      </div>
    )
}


{/* <Input
    label= "標題名稱"
    value= string
    type = {text}
    required = {true}
    onChange={(e) => setInputValue(e.target.value)} //看需求
    flexDirection = 'row' | 'col'
    labelClassName= string //看需求
    inputClassName= string //看需求
    width= 'full' | 'fit'
    leftIcon= "solar:pen-line-duotone"
    placeholder= "placeholder"
    isLoading= {isLoading}
    tokenMaxCount=[current: number, max: number] 
    errorMessage={errorMessage}
    disabled = {isDisabled}
/> */}

