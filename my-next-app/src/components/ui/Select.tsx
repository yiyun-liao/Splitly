import { useRef } from "react";
import Icon from "./Icon";
import clsx from "clsx";

interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
  }

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    value?: string;
    required?: boolean;
    placeholder?:string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    flexDirection?: "row" | "col";
    labelClassName?: string;
    selectClassName?: string;
    width?: "full" | "fit";
    leftIcon?: string;
    isLoading?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    options: SelectOption[];
}

export default function Select({
    label,
    value,
    required = false,
    placeholder,
    onChange,
    flexDirection = "row",
    labelClassName,
    selectClassName,
    width = "fit",
    leftIcon,
    isLoading = false,
    disabled = false,
    errorMessage,
    options,
    ...props
}: SelectProps) {
    const selectRef = useRef<HTMLSelectElement>(null);

    const hasError = !!errorMessage;

    const selectFrameClass = clsx(
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
    const selectItemClass = clsx("w-full", selectClassName);
    const selectClasses = "w-full stroke-none outline-none bg-transparent";
    const helperClasses = 'flex items-start justify-end gap-1 w-full text-sm my-1 min-h-5 transition-all duration-200 ';
    const errorMessageClasses = 'text-red-400 break-words w-full ';

    const leftIconNode = leftIcon ? <Icon icon={leftIcon} size="md" className="mr-2" /> : null;

    return (
        <div className={selectFrameClass}>
        {label && <label className={labelClasses}>{label}</label>}
        <div className={selectItemClass}>
            <div className={wrapperClass}>
            {leftIconNode}
            <select
                ref={selectRef}
                value={value}
                required={required}
                disabled={disabled || isLoading}
                onChange={onChange}
                className={selectClasses}
                {...props}
            >
                { !!placeholder && 
                    <option value="placeholder" disabled >
                    {placeholder}
                    </option>
                }
                {options.map((opt: SelectOption) => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                    </option>
                ))}
            </select>
            {isLoading && (
                <div className="ml-2">
                    <Icon icon="solar:spinner" size="lg" className="animate-spin" />
                </div>
            )}
            </div>
            <div className={helperClasses}>
                {errorMessage && <p className={errorMessageClasses}>{errorMessage}</p>}
            </div>  
        </div>
        </div>
    );
}


{/* <Select
    label="選擇分類"
    value={selectedCategory}
    required = {true}
    placeholder = "placeholder";
    onChange={(e) => setSelectedCategory(e.target.value)}
    flexDirection= "row" | "col"
    labelClassName= "string"; //看需求
    selectClassName= "string"; //看需求
    width= "full" | "fit"
    leftIcon="solar:document-bold-duotone"
    isLoading={false}
    disabled={false}
    errorMessage={formErrorａ}
    options={[
        { label: "工作", value: "work" , disabled: true},
        { label: "生活", value: "life" , disabled: true },
        { label: "娛樂", value: "entertainment"  , disabled: true},
    ]}
/> */}
