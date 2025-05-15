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
        "inline-block rounded-xl overflow-hidden cursor-pointer bg-zinc-50/10 border-zinc-50/10 hover:bg-zinc-900/10 hover:border-zinc-900/10 active:bg-zinc-900/40 active:border-zinc-900/40 cursor-pointer",
        {
            "min-h-9 min-w-9 text-sm": size === "sm",
            "min-h-12 min-w-12 text-base": size === "md",
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
                    width= {imgSize}
                    height = {imgSize}
                    className="object-cover inline-flex items-center justify-center text-current"
                    onError={() => setHasError(true)}
                />
            ):(
                <div
                    style={{ width: imgSize, height: imgSize }}
                    className="bg-sp-blue-400 flex items-center justify-center text-white font-bold text-xs hover:bg-sp-blue-500 hover:text-sm active:bg-sp-blue-600"
                >
                    {imageName.charAt(0)}{imageName.charAt(1)}
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