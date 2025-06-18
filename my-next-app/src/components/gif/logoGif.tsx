'use client';

import React from 'react';
import { useCarousel } from '@/hooks/useCarousel';

const FRAMES = [
  '/logoGif/logo-1.svg',
  '/logoGif/logo-2.svg',
  '/logoGif/logo-3.svg',
  '/logoGif/logo-4.svg',
  '/logoGif/logo-3.svg',
  '/logoGif/logo-2.svg',
  '/logoGif/logo-1.svg',
  '/logoGif/logo-2.svg',
  '/logoGif/logo-3.svg',
  '/logoGif/logo-8.svg',
  '/logoGif/logo-3.svg',
  '/logoGif/logo-2.svg',
];

interface GifProps {
  interval?: number;
  fadeDuration?: number;
  className?: string;
}

export const LogoGif = React.memo(function LogoGif({
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
