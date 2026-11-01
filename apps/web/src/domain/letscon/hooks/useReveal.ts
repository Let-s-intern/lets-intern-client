'use client';

import { useEffect, useRef } from 'react';

const REVEAL_TARGET = '[data-reveal]:not([data-revealed])';

/**
 * 돌려준 ref 안의 [data-reveal] 이 화면에 들어오면 data-revealed 를 붙인다. 한 번만 실행한다.
 * 나중에 그려지는 요소가 있으면 그 조건을 refreshKey 로 넘긴다
 */
export const useReveal = (refreshKey: unknown) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          target.setAttribute('data-revealed', '');
          observer.unobserve(target);
        });
      },
      // 화면에 닿기 직전에 시작해야 다 보인 뒤 사라졌다 나타나는 깜빡임이 없다
      { rootMargin: '0px 0px 40px 0px' },
    );
    root.querySelectorAll(REVEAL_TARGET).forEach((element) => {
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [refreshKey]);

  return rootRef;
};
