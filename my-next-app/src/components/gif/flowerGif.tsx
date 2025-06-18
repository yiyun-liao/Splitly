'use client';

import React from 'react';
import { useCarousel } from '@/hooks/useCarousel';

const FRAMES = [
  '/flowerGif/flower-1.svg',
  '/flowerGif/flower-2.svg',
  '/flowerGif/flower-3.svg',
  '/flowerGif/flower-4.svg',
  '/flowerGif/flower-3.svg',
];

interface GifProps {
  interval?: number;
  fadeDuration?: number;
  className?: string;
}

export const FlowerGif = React.memo(function FlowerGif({
  interval = 500,
  className,
}: GifProps) {
  const { current: src } = useCarousel(FRAMES, interval);

  return (
    <img
      src={src}
      alt="flower animation"
      className={className}
    />
  );
});
