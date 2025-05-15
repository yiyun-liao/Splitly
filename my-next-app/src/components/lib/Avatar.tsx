import Image from 'next/image';

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
  onAvatarClick: () => void;
}

export default function Avatar({
        size = 'sm',
        img,
        userName,
        onAvatarClick,
        ...props
    }: AvatarProps) {

    const dimension = SIZE_MAP[size];

    return (
        <div
            onClick={onAvatarClick}
            className='inline-block rounded-full overflow-hidden cursor-pointer'
            style={{ width: dimension, height: dimension }}
            {...props}
        >
            <Image
                src={img || ''}
                alt={userName || 'user'} 
                title={userName|| 'user'} 
                width={dimension}
                height={dimension}
                className="rounded-full object-cover"
            />
        </div>
    );
}

{/* <Avatar
    size="md"
    img={user?.avatar}
    userName = {user?.name}
    onAvatarClick={() => console.log('Clicked!')}
/> */}