import { Icon as IconifyIcon } from '@iconify/react';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<IconSize, string> = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
};

type IconProps = {
  icon: string;
  size?: IconSize;
  className?: string;
  label?: string;
};

export default function Icon({
        icon,
        size = 'md',
        className = '',
        label,
    }: IconProps) {
        const style = 'inline-flex items-center justify-center text-current'
    return (
        <IconifyIcon
            icon={icon}
            className={`${style} ${SIZE_MAP[size]} ${className}`}
            aria-label={label}
            role="img"
        />
    );
}

//<Icon 
//  icon='solar:user-circle-outline'
//  size='sm' | 'md' | 'lg' | 'xl'
//  className="text-red-500" //根據需求
// />