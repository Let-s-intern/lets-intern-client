'use client';

import { useEffect, useRef } from 'react';

const GROUP = '[data-reveal-group]';
const ITEM = '[data-reveal]';
const CHECKED = 'data-reveal-checked';

/**
 * 돌려준 ref 안의 [data-reveal] 이 화면에 닿기 직전에 data-revealed 를 붙인다. 한 번만 실행한다.
 * [data-reveal-group] 은 묶음을 하나로 보고 안의 요소를 함께 재생한다.
 * 관찰 시점에 이미 화면 안이면 재생하지 않는다. 보이던 요소가 사라졌다 나타나게 되기 때문이다.
 * 나중에 그려지는 요소가 있으면 그 조건을 refreshKey 로 넘긴다
 */
export const useReveal = (refreshKey: unknown) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const play = (target: Element) => {
      const items = target.matches(ITEM)
        ? [target]
        : target.querySelectorAll(ITEM);
      items.forEach((item) => item.setAttribute('data-revealed', ''));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target, boundingClientRect }) => {
          if (!isIntersecting) return;
          target.setAttribute(CHECKED, '');
          observer.unobserve(target);
          if (boundingClientRect.top >= window.innerHeight) play(target);
        });
      },
      { rootMargin: '0px 0px 80px 0px' },
    );

    root.querySelectorAll(`${GROUP}, ${ITEM}`).forEach((target) => {
      const isGrouped = target.matches(ITEM) && target.closest(GROUP);
      if (!isGrouped && !target.hasAttribute(CHECKED)) {
        observer.observe(target);
      }
    });
    return () => observer.disconnect();
  }, [refreshKey]);

  return rootRef;
};
