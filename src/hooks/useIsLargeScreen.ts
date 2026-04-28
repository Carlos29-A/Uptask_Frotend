import { useState, useEffect } from 'react';

export function useIsLargeScreen(breakpoint = 1024) {
    const [isLarge, setIsLarge] = useState(() => window.innerWidth >= breakpoint);

    useEffect(() => {
        const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
        const handler = (e: MediaQueryListEvent) => setIsLarge(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [breakpoint]);

    return isLarge;
}
