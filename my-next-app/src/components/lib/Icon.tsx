import { Icon as IconifyIcon } from '@iconify/react';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
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
        const fontSize = SIZE_MAP[size];
        let style = 'inline-block vertical-middle leading-6'
    return (
        <IconifyIcon
            icon={icon}
            width={SIZE_MAP[size]}
            height={SIZE_MAP[size]}
            className={`${style} ${fontSize} ${icon} ${className}`}
            aria-label={label}
            role="img"
        />
    );
}

//<Icon icon="solar:user-circle-outline" size="sm" className="text-red-500" />