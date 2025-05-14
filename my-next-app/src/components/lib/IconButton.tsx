import Icon from "./Icon"
import clsx from 'clsx';


interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string;
    size?: 'sm' | 'md';
    variant?: 'solid' | 'text-button' | 'outline';
    color: 'primary' | 'zinc';
    isLoading?: boolean;
    disabled?: boolean;
    type? : 'button' | 'submit' | 'reset';
  }

function Loading({ isLoading, size }: { isLoading: boolean; size: 'sm' | 'md' }) {
    const iconSize = size === 'sm' ? 'md' : 'lg';
    const visibility = isLoading ? 'visible' : 'invisible';
    return <Icon icon="solar:refresh-bold" size={iconSize} className={`absolute rotate-360 animate-spin ${visibility}`} />;
}

function getDisabledStyles(variant: IconButtonProps['variant'], color: IconButtonProps['color']) {
    if (variant === 'solid') {
        if (color === 'primary') {
            return "text-zinc-50 bg-blue-200 stroke-blue-200";
        } else {
            return "text-zinc-50 bg-zinc-200 stroke-zinc-200";
        }
    }
    if (variant === 'outline') {
        if (color === 'primary') {
            return " text-blue-200 bg-zinc-50 stroke-blue-200";
        } else {
            return " text-zinc-200 bg-zinc-50 stroke-zinc-200";
        }
    }
    if (variant === 'text-button') {
        if (color === 'primary') {
            return " text-blue-200 bg-zinc-50/10 stroke-zinc-50/10";
        } else {
            return " text-zinc-200 bg-zinc-50/10 stroke-zinc-50/10";
        }
    }
}

export default function IconButton({ 
        icon = 'solar:stop-outline',
        size = 'sm',
        variant= 'solid', 
        color = 'primary',
        isLoading = false,
        disabled = false,
        type = 'button',
        onClick,
    ...props}:IconButtonProps){

    const isDisabled = disabled || isLoading;
  
    const baseClasses = clsx(
        "relative font-semibold stroke-1 stroke-inherit inline-flex items-center justify-center rounded-xl whitespace-nowrap align-middle",
        {
            "min-h-9 min-w-9 text-sm": size === "sm",
            "min-h-12 min-w-12 text-base": size === "md",
        },
        // variant & color styles
        {
            // solid
            "text-zinc-50 bg-blue-500 stroke-blue-500 hover:bg-blue-600 hover:stroke-blue-600 active:bg-blue-800 active:stroke-blue-800":
                variant === "solid" && color === "primary" && !isDisabled,
            "text-zinc-50 bg-zinc-700 stroke-zinc-700 hover:bg-zinc-800 hover:stroke-zinc-800 active:bg-zinc-900 active:stroke-zinc-900":
                variant === "solid" && color === "zinc" && !isDisabled,
        
            // outline
            "text-blue-500 bg-zinc-50 stroke-blue-500 hover:text-blue-600 hover:bg-blue-100 hover:stroke-blue-600 active:text-blue-800 active:bg-blue-200 active:stroke-blue-800":
                variant === "outline" && color === "primary" && !isDisabled,
            "text-zinc-700 bg-zinc-50 stroke-zinc-700 hover:text-zinc-800 hover:bg-zinc-900/10 hover:stroke-zinc-800 active:text-zinc-900 active:bg-zinc-900/40 active:stroke-zinc-900":
                variant === "outline" && color === "zinc" && !isDisabled,
        
            // text-button
            "text-blue-500 bg-zinc-50/10 stroke-zinc-50/10 hover:text-blue-600 hover:bg-zinc-900/10 hover:stroke-zinc-900/10 active:text-blue-800 active:bg-zinc-900/40 active:stroke-zinc-900/40":
                variant === "text-button" && color === "primary" && !isDisabled,
            "text-zinc-700 bg-zinc-50/10 stroke-zinc-50/10 hover:text-zinc-800 hover:bg-zinc-900/10 hover:stroke-zinc-900/10 active:text-zinc-900 active:bg-zinc-900/40 active:stroke-zinc-900/40":
                variant === "text-button" && color === "zinc" && !isDisabled,
        },
        // disabled
        {
            "cursor-pointer" : !isDisabled,
            [getDisabledStyles(variant, color)!]: isDisabled,
            "cursor-not-allowed pointer-events-none": isDisabled,
        }
    );
    

    //isLoading = true 時，不想讓文字和 icon 顯示出來，但還是要保留原本空間避免 layout shift
    const Content = ({ isLoading, size }: { isLoading: boolean; size: 'sm' | 'md' }) => {
        const iconSize = size === 'sm' ? 'md' : 'lg';
        const visibility = isLoading ? 'invisible' : 'visible';
        return (
            <Icon icon={icon} size={iconSize} className={` ${visibility}`} />
        );
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (isLoading) return;
      onClick?.(event);
    };
  
    return (
      <button className={baseClasses} disabled={disabled || isLoading} onClick={handleClick} type={type} {...props}>
        <Content isLoading={isLoading} size={size}  />
        <Loading isLoading={isLoading} size={size} />
      </button>
    );
}

{/* <IconButton
    icon='solar:star-angle-bold'
    size='sm' | 'md'
    variant='solid' | 'text-button' | 'outline'
    color='primary' | 'zinc'
    disabled={isdisabled} //根據需求
    isLoading={isLoading} //根據需求
    type= 'button' | 'submit' | 'reset'
    onClick={handleClick} >
</IconButton> */}