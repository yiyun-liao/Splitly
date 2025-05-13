import Icon from "./Icon"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    size?: 'sm' | 'md';
    width?: 'full' | 'fit';
    variant?: 'solid' | 'text-button' | 'outline';
    color: 'primary' | 'plain';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isLoading?: boolean;
    disable?: boolean;
  }

function Loading({ isLoading }: { isLoading: boolean }) {
    const visibility = isLoading ? 'visible' : 'invisible';
    return <Icon icon="i-mdi-loading" size="xl" className={`absolute rotate-360 animate-spin ${visibility}`} />;
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
    ...props}:ButtonProps){
  
    let style = "px-4 py-0 font-semibold stroke-1 stroke-inherit inline-flex items-center rounded-xl whitespace-nowrap"
    
    // size
    style += size === 'sm' ? ' min-h-9 text-sm' : ' min-h-12 text-base'

    //width
    style += width === 'full' ? ' w-full' : ' w-fit'

      // variant
    if (variant === 'solid') {
        style += ' text-stone-900 bg-indigo-400 hover:bg-indigo-600';
    } else if (variant === 'text-button') {
        style += ' text-indigo-500 hover:text-zinc-100 hover:bg-indigo-600';
    }if(variant === 'outline'){
        style += " text-indigo-500 hover:text-zinc-100 hover:bg-indigo-600"
    }

    const leftIconNode = leftIcon ? <Icon icon={leftIcon} size="xl" className="mr-2" /> : null;
    const rightIconNode = rightIcon ? <Icon icon={rightIcon} size="xl" className="ml-2" /> : null;

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

    const onButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (isLoading) return;
      onClick(event);
    };
  
    return (
      <button className={classNames} disabled={disabled} onClick={onButtonClick} {...props}>
        <Content isLoading={isLoading} />
        <Loading isLoading={isLoading} />
      </button>
    );
}