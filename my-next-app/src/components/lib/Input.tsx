import { useRef, useState } from "react";
import Icon from "./Icon"

interface InputProps  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    flexDirection? : 'row' | 'col';
    labelClassName?: string;
    inputClassName?: string;
    width?: 'full' | 'fit';
    leftIcon?: string;
    rightIcon?: string;
    placeholder?: string;
    isLoading?: boolean;
    disabled?: boolean;
    tokenMaxCount?:[current: number, max: number];
    errorMessage?: string;
}

export default function Input({
        label,
        value,
        onChange,
        flexDirection = 'row',
        labelClassName,
        inputClassName,
        width = 'fit',
        leftIcon,
        rightIcon = 'solar:close-circle-line-duotone',
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
        if (tokenMaxCount && tokenMaxCount[0] > tokenMaxCount[1]) return true;
        return false;
    };
      
    const hasError = isInputError();

    let inputFrameClass = 'flex cursor-pointer items-start justify-start'
    //flexDirection
    inputFrameClass += flexDirection === 'row' ? 'flex-row gap-2' : 'flex-col gap-1';
    //width
    inputFrameClass += width === 'full' ? ' w-full' : ' w-fit';
    
    let wrapperClassNames = 'px-3 py-2 text-base ring-1 stroke-inherit rounded-xl tracking-widest flex items-center justify-start text-zinc-700';

    if (disabled){
        wrapperClassNames += ' bg-zinc-100 text-zinc-400 ring-zinc-400 cursor-not-allowed';
    } if (hasError){
        wrapperClassNames += ' ring-red-400 hover:ring-red-400 focus-within:ring-red-400 focus-within:border-red-400'
    } else {
        wrapperClassNames += ' bg-zinc-50 ring-zinc-400 hover:text-zinc-700 hover:ring-zinc-700 active:text-zinc-900 active:ring-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900';
    }

    const labelClasses = 'w-fit min-w-20 min-h-9 whitespace-nowrap flex items-center justify-start';
    
    const inputItemClass = 'w-3xs wrap-anywhere'
    const inputClasses = 'w-full stroke-none outline-none';

    const helperClasses = 'flex items-start justify-end gap-1 w-full text-sm my-1 min-h-5';
    const errorMessageClasses = 'text-red-400 break-words w-full ';
    let tokenCountClasses = 'whitespace-nowrap flex-shrink-0';

    if (disabled){
        tokenCountClasses += ' text-zinc-400'
    } if (tokenMaxCount && tokenMaxCount[0]>tokenMaxCount[1]){
        tokenCountClasses += ' text-red-400 font-semibold'
    }

    const leftIconNode = leftIcon ? <Icon icon={leftIcon} size="md" className="mr-2" /> : null;
    const rightIconNode = !disabled && !isLoading && value ? (
        <button type="button" onClick={handleClear} className="ml-2">
          <Icon icon={rightIcon} size="lg" />
        </button>
    ) : isLoading ? (
        <div className="ml-2">
          <Icon icon="solar:spinner" size="lg" className="animate-spin" />
        </div>
    ) : rightIcon ? (
        <Icon icon={rightIcon} size="lg" className="ml-2" />
    ) : null;
    

    return (
      <div className={inputFrameClass}>
            {label && <label className={`${labelClasses} ${labelClassName}`}>{label}</label>}
            <div className={`${inputItemClass} ${inputClassName}`}>
                <div className={wrapperClassNames}>
                    {leftIconNode}
                    <input
                        ref={inputRef} 
                        value={value} 
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