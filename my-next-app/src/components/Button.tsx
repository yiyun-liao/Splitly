interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant: 'solid' | 'text-button';
    width: 'full' | 'fit';
  }

export default function Button({children, variant= 'solid', width = 'fit', ...props}:ButtonProps){
  
    let style = "w-fit px-3 py-2 font-semibold rounded whitespace-nowrap"

    if (width === 'full'){
        style += " w-full"
    }

    if (variant === 'solid'){
      style += " text-stone-900 bg-indigo-400 hover:bg-indigo-600"
    }if(variant === 'text-button'){
      style += " text-indigo-500 hover:text-zinc-100 hover:bg-indigo-600"
    }
  
    return(
      <button 
      className={style} {...props}>
        {children}
      </button>
    )
  };