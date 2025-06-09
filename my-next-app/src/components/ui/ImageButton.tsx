'use client';
import clsx from 'clsx';
import { useState } from 'react';


interface ImageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    image?: string;
    size?: 'sm' | 'md';
    imageName: string;
    className?:string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}


export default function ImageButton({ 
        image,
        size = 'sm',
        imageName,
        className,
        onClick,
    ...props}:ImageButtonProps){
  
    const [hasError, setHasError] = useState(false);

    const baseClasses = clsx(
        "relative inline-block  overflow-hidden cursor-pointer  cursor-pointer flex-shrink-0",
        "bg-sp-blue-200 border-zinc-50/10 hover:bg-zinc-900/10 hover:border-zinc-900/10 active:bg-zinc-900/40 active:border-zinc-900/40",
        "rounded-xl animate-breathing",
        {
            "h-9 w-9 text-sm": size === "sm",
            "h-12 w-12 text-base": size === "md",
        },
        className
    );

    const imgSize = size === 'sm' ? 36 : 48 ;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onClick?.(event);
    };

    return (
        <button className={baseClasses} onClick={handleClick} {...props}>
            {!hasError && image ? (
                <img 
                    src={image}
                    alt={imageName ?? 'image-button'}
                    title={imageName}
                    className="absolute inset-0 w-full h-full object-cover text-current transition-transform duration-200 ease-in-out hover:scale-120"
                    onError={() => setHasError(true)}
                />
            ):(
                <div
                    style={{ width: imgSize, height: imgSize }}
                    className={clsx(
                        "flex items-center justify-center text-white font-bold text-xs  transition-transform duration-200 ease-in-out",
                        "bg-sp-blue-400  hover:bg-sp-blue-500 hover:text-base active:bg-sp-blue-600",
                        "rounded-xl"
                    )}
                >
                    {imageName ? imageName.charAt(0).toUpperCase() + imageName.charAt(1).toUpperCase() : '??'}
              </div>
            )}
        </button>
    );
}

{/* <ImageButton
    image='/logo/file.svg'
    size='sm' | 'md'
    imageName= "Splitly logo"
    className=string; //根據需求
    onClick={() => console.log('Clicked!')} >
</ImageButton> */}