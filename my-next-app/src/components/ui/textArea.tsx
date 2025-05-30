import { useRef, useEffect } from "react";
import Icon from "./Icon"
import clsx from 'clsx';


interface TextareaProps  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    value?: string;
    rows?:number;
    maxRows?: number;
    required?:boolean;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    flexDirection? : 'row' | 'col';
    labelClassName?: string;
    textAreaClassName?: string;
    width?: 'full' | 'fit';
    leftIcon?: string;
    placeholder?: string;
    isLoading?: boolean;
    disabled?: boolean;
    tokenMaxCount?: [current: number, max: number] | undefined;
    errorMessage?: string;
}

export default function TextArea({
        label,
        value,
        rows = 2,
        maxRows = 4,
        required = false,
        onChange,
        flexDirection = 'row',
        labelClassName,
        textAreaClassName,
        width = 'fit',
        leftIcon,
        placeholder,
        isLoading = false,
        disabled = false, 
        tokenMaxCount,
        errorMessage, 
    ...props}:TextareaProps){

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const lineHeight = 24; // 行高（依據 Tailwind 的 text-base 通常約為 1.5rem = 24px）
  
    // 自動調整高度
    useEffect(() => {
      const textarea = textAreaRef.current;
      if (textarea) {
        textarea.style.height = "auto"; // 先重置高度
        const maxHeight = maxRows * lineHeight;
  
        textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
      }
    }, [value, maxRows]);

    // 清空 input 內容
    const handleClear = () => {
        onChange({ target: { value: '' } } as React.ChangeEvent<HTMLTextAreaElement>);
        textAreaRef.current?.focus();
    };

    const isTextAreaError = () => {
        if (errorMessage) return true;
        if (tokenMaxCount && typeof tokenMaxCount[1] === 'number' && tokenMaxCount[0] > tokenMaxCount[1] ) return true;
        return false;
    };
      
    const hasError = isTextAreaError();

    const textAreaFrameClass = clsx(
        "flex cursor-pointer items-start justify-start",
        {
          "flex-row gap-2": flexDirection === "row",
          "flex-col gap-1": flexDirection === "col",
          "w-full": width === "full",
          "w-fit": width === "fit",
        }
    );

    const wrapperClass = clsx(
        "px-3 py-2 h-fit min-h-9 text-base ring-1 stroke-inherit rounded-xl tracking-widest flex items-start justify-start",
        {
          "bg-zinc-200 text-zinc-400 ring-zinc-200 cursor-not-allowed": disabled || isLoading,
          "cursor-pointer text-zinc-700 bg-zinc-50 hover:text-zinc-700 active:text-zinc-900 " : !disabled && !isLoading,
          "ring-red-400 hover:ring-red-400 active:ring-red-400 focus-within:ring-red-500 focus-within:border-red-500": hasError,
          "ring-zinc-400 hover:ring-zinc-700 active:ring-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 focus-within:border-zinc-900":  !hasError && !disabled && !isLoading,
        }
    );
    
    const labelClasses = clsx( "min-w-20 max-w-40 min-h-9 text-wrap flex items-center justify-start",labelClassName);
    const textAreaItemClass = clsx("w-full min-w-3xs wrap-anywhere", textAreaClassName);
    const textAreaClasses = 'w-full stroke-none outline-none';
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
      <div className={textAreaFrameClass}>
            {label && <label className={labelClasses}>{label}</label>}
            <div className={textAreaItemClass}>
                <div className={wrapperClass}>
                    {leftIconNode}
                    <textarea
                        ref={textAreaRef} 
                        value={value ?? ""}
                        rows={rows}
                        style={{ overflowY: "auto", resize: "none" }} // 禁止手動拉伸
                        required={required}
                        className={textAreaClasses} 
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


{/* <TextArea
    label= "標題名稱"
    value={string}
    rows = {2}
    maxRows = {4}
    required = {true}
    onChange={(e) => setInputValue(e.target.value)} //看需求
    flexDirection = 'row' | 'col'
    labelClassName= string //看需求
    textAreaClassName= string //看需求
    width= 'full' | 'fit'
    leftIcon= "solar:pen-line-duotone"
    placeholder= "placeholder"
    isLoading= {isLoading}
    tokenMaxCount=[current: number, max: number] 
    errorMessage={errorMessage}
    disabled = {isDisabled}
/> */}

