import clsx from 'clsx';
import { useState } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 56,
};


interface AvatarProps {
  size?: AvatarSize;
  img?: string;
  userName?: string;
  className?: string;
  onAvatarClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export default function Avatar({
        size = 'sm',
        img,
        userName,
        onAvatarClick,
        className,
        ...props
    }: AvatarProps) {
    
    const [hasError, setHasError] = useState(false);
    const avatarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onAvatarClick?.(event);
    };

    const dimension = SIZE_MAP[size];
    const divClass = clsx('relative inline-block rounded-full overflow-hidden cursor-pointer animate-breathing', className)
    
    return (
        <div
            onClick={avatarClick}
            className={divClass}
            style={{ width: dimension, height: dimension }}
            {...props}
        >
            {!hasError && img ? (
                <img 
                    src={img}
                    alt={userName ?? 'user-avatar'}
                    title={userName}
                    className="absolute inset-0 w-full h-full object-cover text-current transition-transform duration-200 ease-in-out hover:scale-120"
                    onError={() => setHasError(true)}
                />
            ):(
                <div
                    style={{ width: dimension, height: dimension}}
                    className="bg-sp-blue-400 flex items-center justify-center text-white font-bold text-xs hover:bg-sp-blue-500 hover:text-base active:bg-sp-blue-600 transition-transform duration-200 ease-in-out"
                >
                    {userName ? userName.charAt(0).toUpperCase() + userName.charAt(1).toUpperCase() : '??'}
              </div>
            )}
        </div>
    );
}

{/* <Avatar
    size="md"
    img={user?.avatar}
    userName = {user?.name}
    onAvatarClick={() => console.log('Clicked!')}
/> */}