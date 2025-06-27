// src/hooks/useCarousel.ts
import { useState, useEffect } from 'react';

/**
 * 通用輪播 hook，任何陣列都能用
 * @param items    任何類型的陣列 (URL、Component、string…)
 * @param interval ms，切換間隔
 */
export function useCarousel<T>(items: T[], interval = 500) {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (items.length === 0) return;
        const timer = setInterval(() => {
            setIdx(prev => (prev + 1) % items.length);
        }, interval);
        return () => clearInterval(timer);
    }, [items, interval]);

    return {
        current: items[idx],
        index: idx,
    };
}

export function useFadeCarousel<T>(
    items: T[],
    interval = 500,
    fadeDuration = 400
  ) {
    const { current: next, index } = useCarousel(items, interval);
  
    const [current, setCurrent] = useState(next);
    const [opacity, setOpacity] = useState(1);
  
    useEffect(() => {
        // 1. 先淡出
        setOpacity(0);
        // 2. fadeDuration 過後，切圖、再淡入
        const t = setTimeout(() => {
            setCurrent(next);
            setOpacity(1);
        }, fadeDuration);
    
        return () => clearTimeout(t);
    }, [next, fadeDuration]);
  
    return {
        current,
        style: {
            opacity,
            transition: `opacity ${fadeDuration}ms ease-in-out`,
        } as React.CSSProperties,
        index,
    };
}
