import { useState, useEffect, useRef, RefObject } from 'react';

export function useScrollDirection(
    scrollRef: RefObject<HTMLElement | null>,
    threshold = 5 // 最小位移門檻
    ): boolean {
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollTop = useRef(0);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
        const currentTop = el.scrollTop;

        // 在頂端 bounce 時重置
        if (currentTop <= 0) {
            lastScrollTop.current = 0;
            setIsScrolled(false);
            return;
        }

        const delta = currentTop - lastScrollTop.current;
        if (delta > threshold) {
            setIsScrolled(true);
        } else if (delta < -threshold) {
            setIsScrolled(false);
        }
        lastScrollTop.current = currentTop;
        };

        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, [scrollRef, threshold]);

    return isScrolled;
}
