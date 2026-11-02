'use client';

import { useEffect, useRef } from 'react';

const GROUP = '[data-reveal-group]';
const ITEM = '[data-reveal]';
const CHECKED = 'data-reveal-checked';
const PENDING = 'data-reveal-pending';

// 화면에 닿기 직전 구간에서만 숨긴다. 이 구간을 건너뛰면 숨긴 적이 없어 빈칸이 생기지 않는다
const HIDE_MARGIN = '0px 0px 200px 0px';
// 화면 75% 선에서 나타난다. 위쪽 여백은 이 선을 지나쳐 화면 위로 간 요소까지 잡기 위한 값이다
const SHOW_MARGIN = '100000px 0px -25% 0px';
// 이보다 빠르면 숨기지도 재생하지도 않는다. 휠 한 칸 안의 순간 속도는 튀므로 구간 평균으로 잰다
const FAST_SCROLL_PX_PER_MS = 1;
const SPEED_WINDOW_MS = 200;
// 75% 선 아래에서 스크롤을 멈추면 빈칸이 남으므로 이만큼 멈춰 있으면 내보낸다
const SCROLL_IDLE_MS = 1000;

/**
 * 돌려준 ref 안의 [data-reveal] 을 스크롤 등장시킨다. 한 번만 실행한다.
 * [data-reveal-group] 은 묶음을 하나로 보고 안의 요소를 함께 재생한다.
 * 숨김은 JS 가 붙이는 속성으로만 걸어, JS 가 실패해도 내용은 보인다.
 * 나중에 그려지는 요소가 있으면 그 조건을 refreshKey 로 넘긴다
 */
export const useReveal = (refreshKey?: unknown) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let scrollSpeed = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let idleTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showPendingInView, SCROLL_IDLE_MS);

      const now = performance.now();
      const elapsed = now - lastTime;
      if (elapsed < SPEED_WINDOW_MS) return;
      scrollSpeed = Math.abs(window.scrollY - lastY) / elapsed;
      lastY = window.scrollY;
      lastTime = now;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const isFastScroll = () => scrollSpeed > FAST_SCROLL_PX_PER_MS;

    const play = (target: Element) => {
      const items = target.matches(ITEM)
        ? [target]
        : target.querySelectorAll(ITEM);
      items.forEach((item) => item.setAttribute('data-revealed', ''));
    };

    const showObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target, boundingClientRect }) => {
          if (!isIntersecting) return;
          showObserver.unobserve(target);
          target.removeAttribute(PENDING);
          // 빠르게 지나쳐 이미 화면 위쪽에 있으면 재생 없이 바로 보인다
          if (
            boundingClientRect.top >= window.innerHeight / 2 &&
            !isFastScroll()
          ) {
            play(target);
          }
        });
      },
      { rootMargin: SHOW_MARGIN },
    );

    const showPendingInView = () => {
      root.querySelectorAll(`[${PENDING}]`).forEach((target) => {
        if (target.getBoundingClientRect().top >= window.innerHeight) return;
        showObserver.unobserve(target);
        target.removeAttribute(PENDING);
        play(target);
      });
    };

    const hideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target, boundingClientRect }) => {
          if (!isIntersecting) return;
          hideObserver.unobserve(target);
          target.setAttribute(CHECKED, '');
          // 이미 화면 안이면 보이던 요소가 사라지므로 숨기지 않는다
          if (boundingClientRect.top < window.innerHeight || isFastScroll()) {
            return;
          }
          target.setAttribute(PENDING, '');
          showObserver.observe(target);
        });
      },
      { rootMargin: HIDE_MARGIN },
    );

    root.querySelectorAll(`${GROUP}, ${ITEM}`).forEach((target) => {
      const isGrouped = target.matches(ITEM) && target.closest(GROUP);
      if (!isGrouped && !target.hasAttribute(CHECKED)) {
        hideObserver.observe(target);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(idleTimer);
      hideObserver.disconnect();
      showObserver.disconnect();
      root.querySelectorAll(`[${PENDING}]`).forEach((target) => {
        target.removeAttribute(PENDING);
        target.removeAttribute(CHECKED);
      });
    };
  }, [refreshKey]);

  return rootRef;
};
