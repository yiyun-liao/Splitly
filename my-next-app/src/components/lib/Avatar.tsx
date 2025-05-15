import Image from 'next/image';
import { useMemo } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 56,
};

const RANDOM_AVATARS = Array.from({ length: 8 }, (_, i) => `/avatar/${i + 1}.jpg`);

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

interface AvatarProps {
  size?: AvatarSize;
  img?: string;
  userId?: string;
  onAvatarClick: () => void;
}

export default function Avatar({
        size = 'sm',
        img,
        userId,
        onAvatarClick,
        ...props
    }: AvatarProps) {

    // 當 img 沒有傳入時，從隨機頭像中選一張
    const fallbackImg = useMemo(() => {
        if (img) return img;
        if (userId) {
        const hash = hashString(userId);
        const index = hash % RANDOM_AVATARS.length;
        return RANDOM_AVATARS[index];
        }
        // 若無 userId 則仍為真正隨機
        const index = Math.floor(Math.random() * RANDOM_AVATARS.length);
        return RANDOM_AVATARS[index];
    }, [img, userId]);

    const dimension = SIZE_MAP[size];

    return (
        <div
            onClick={onAvatarClick}
            className='inline-block rounded-full overflow-hidden cursor-pointer'
            style={{ width: dimension, height: dimension }}
            {...props}
        >
        <Image
            src={fallbackImg}
            alt={userId || 'user'} 
            title={userId|| 'user'} 
            width={dimension}
            height={dimension}
            className="rounded-full object-cover"
        />
        </div>
    );
}
