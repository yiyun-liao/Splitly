import Icon from "./Icon"
import clsx from 'clsx';


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: 'sm' | 'md';
    width?: 'full' | 'fit';
    variant?: 'solid' | 'text-button' | 'outline';
    color: 'primary' | 'zinc';
    leftIcon?: string;
    rightIcon?: string;
    isLoading?: boolean;
    disabled?: boolean;
    type? : 'button' | 'submit' | 'reset';
  }

function Loading({ isLoading, size }: { isLoading: boolean; size: 'sm' | 'md' }) {
    const iconSize = size === 'sm' ? 'md' : 'lg';
    const visibility = isLoading ? 'visible' : 'invisible';
    return <Icon icon="solar:refresh-bold" size={iconSize} className={`absolute rotate-360 animate-spin ${visibility}`} />;
}

function getDisabledStyles(variant: ButtonProps['variant'], color: ButtonProps['color']) {
    if (variant === 'solid') {
        if (color === 'primary') {
            return "text-zinc-50 bg-zinc-300 border-sp-blue-300";
        } else {
            return "text-zinc-50 bg-zinc-300 border-zinc-300";
        }
    }
    if (variant === 'outline') {
        if (color === 'primary') {
            return " text-zinc-400 bg-zinc-50 border-sp-blue-200";
        } else {
            return " text-zinc-200 bg-zinc-50 border-zinc-200";
        }
    }
    if (variant === 'text-button') {
        if (color === 'primary') {
            return " text-zinc-400 bg-zinc-50/10 border-zinc-50/10";
        } else {
            return " text-zinc-200 bg-zinc-50/10 border-zinc-50/10";
        }
    }
}

export default function Button({
        children, 
        size = 'sm',
        width = 'fit',    
        variant= 'solid', 
        color = 'primary',
        leftIcon,
        rightIcon,
        isLoading = false,
        disabled = false,
        type = 'button',
        onClick,
    ...props}:ButtonProps){
  

    const isDisabled = disabled || isLoading;

    const baseClasses = clsx(
        "relative px-4 py-0 font-semibold border-1 inline-flex items-center justify-center rounded-xl whitespace-nowrap align-middle",
        // size
        {
            "min-h-9 min-w-9 text-sm" : size === "sm",
            "min-h-12 min-w-12 text-base" : size === "md",
        },
        // width
        {
            "w-full text-center" : width === "full",
            "w-fit" : width === "fit",
        },
        // variant & color styles
        {
            // solid
            "text-zinc-50 bg-sp-blue-500 border-sp-blue-500 hover:bg-sp-blue-600 hover:border-sp-blue-600 active:bg-sp-blue-800 active:border-sp-blue-800":
              variant === "solid" && color === "primary" && !isDisabled,
            "text-zinc-50 bg-zinc-700 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-800 active:bg-zinc-900 active:border-zinc-900":
              variant === "solid" && color === "zinc" && !isDisabled,
      
            // outline
            "text-sp-blue-500 bg-zinc-50 border-sp-blue-500 hover:text-sp-blue-600 hover:bg-sp-blue-100 hover:border-sp-blue-600 active:text-sp-blue-800 active:bg-sp-blue-200 active:border-sp-blue-800":
              variant === "outline" && color === "primary" && !isDisabled,
            "text-zinc-700 bg-zinc-50 border-zinc-700 hover:text-zinc-800 hover:bg-zinc-900/10 hover:border-zinc-800 active:text-zinc-900 active:bg-zinc-900/40 active:border-zinc-900":
              variant === "outline" && color === "zinc" && !isDisabled,
      
            // text-button
            "text-sp-blue-500 bg-zinc-50/10 border-zinc-50/10 hover:text-sp-blue-600 hover:bg-zinc-900/10 hover:border-zinc-900/10 active:text-sp-blue-800 active:bg-zinc-900/40 active:border-zinc-900/40":
              variant === "text-button" && color === "primary" && !isDisabled,
            "text-zinc-700 bg-zinc-50/10 border-zinc-50/10 hover:text-zinc-800 hover:bg-zinc-900/10 hover:border-zinc-900/10 active:text-zinc-900 active:bg-zinc-900/40 active:border-zinc-900/40":
              variant === "text-button" && color === "zinc" && !isDisabled,
          },
          // disabled
          {
            "cursor-pointer" : !isDisabled,
            [getDisabledStyles(variant, color)!]: isDisabled,
            "cursor-not-allowed": isDisabled,
          }
    )

    const iconSize = size === 'sm' ? 'md' : 'lg';
    const leftIconNode = leftIcon ? <Icon icon={leftIcon} size={iconSize} className="mr-2" /> : null;
    const rightIconNode = rightIcon ? <Icon icon={rightIcon} size={iconSize} className="ml-2" /> : null;

    //isLoading = true 時，不想讓文字和 icon 顯示出來，但還是要保留原本空間避免 layout shift
    const Content = ({ isLoading }: { isLoading: boolean }) => {
      const visibility = isLoading ? 'invisible' : 'visible';
      return (
        <span className={`inline-flex justify-center items-center ${visibility}`}>
          {leftIconNode}
          {children}
          {rightIconNode}
        </span>
      );
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (isLoading) return;
        onClick?.(event);
    };
  
    return (
      <button className={baseClasses} disabled={disabled || isLoading} onClick={handleClick} type={type} {...props}>
        <Content isLoading={isLoading} />
        <Loading isLoading={isLoading} size={size} />
      </button>
    );
}

{/* <Button
    size='sm' | 'md'
    width='full' | 'fit'
    variant='solid' | 'text-button' | 'outline'
    color='primary' | 'zinc'
    leftIcon='solar:user-circle-outline'
    rightIcon='solar:user-circle-outline'
    disabled={isdisabled} //根據需求
    isLoading={isLoading} //根據需求
    onClick={handleClick} >
        Log in
</Button> */}