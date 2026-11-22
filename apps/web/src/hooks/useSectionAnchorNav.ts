'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const HEADER_HEIGHT_DESKTOP = 155;
const HEADER_HEIGHT_MOBILE = 84;
/** 이동이 멈췄다고 보는 시간(ms). 이 동안 스크롤이 없으면 도착한 것이다 */
const SCROLL_IDLE_MS = 140;

/**
 * 상세 페이지 상단 앵커 탭. 지금 보는 섹션 표시와 눌렀을 때의 부드러운 이동을 맡는다.
 *
 * 탭을 누르면 이동하는 동안 지나가는 섹션마다 표시가 바뀌어 깜빡였다.
 * 그래서 누른 탭을 바로 선택하고, 이동이 멈출 때까지는 스크롤 감시를 잠가 둔다.
 * 도착한 뒤에는 이미지 로딩 등으로 밀린 위치를 한 번 바로잡는다.
 */
export default function useSectionAnchorNav(
  ids: string[],
  isReady = true,
  offset = 70,
) {
  const [active, setActive] = useState(ids[0]);
  const isLockedRef = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const idsKey = ids.join('|');

  useEffect(() => {
    if (!isReady || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isLockedRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );

    idsKey.split('|').forEach((id) => {
      const target = document.getElementById(id);
      if (target) observer.observe(target);
    });

    return () => observer.disconnect();
  }, [idsKey, isReady]);

  useEffect(() => () => cleanupRef.current?.(), []);

  const scrollTo = useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      cleanupRef.current?.();
      setActive(id);
      isLockedRef.current = true;

      const headerHeight = window.matchMedia('(min-width: 1024px)').matches
        ? HEADER_HEIGHT_DESKTOP
        : HEADER_HEIGHT_MOBILE;
      const targetTop = () =>
        target.getBoundingClientRect().top + window.scrollY;
      // 위로 올라갈 때는 헤더가 다시 나오니 그만큼 더 비운다
      const goingUp = targetTop() < window.scrollY;
      const destination = () =>
        Math.max(0, targetTop() - offset - (goingUp ? headerHeight : 0));

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      window.scrollTo({
        top: destination(),
        behavior: reduceMotion ? 'auto' : 'smooth',
      });

      let timer = 0;
      const finish = () => {
        window.removeEventListener('scroll', onScroll);
        isLockedRef.current = false;
        cleanupRef.current = null;
        // 이동 중에 위쪽 내용이 늘어나 위치가 밀렸으면 한 번만 바로잡는다
        if (Math.abs(window.scrollY - destination()) > 4) {
          window.scrollTo({ top: destination(), behavior: 'auto' });
        }
      };
      const onScroll = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(finish, SCROLL_IDLE_MS);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanupRef.current = () => {
        window.clearTimeout(timer);
        window.removeEventListener('scroll', onScroll);
        isLockedRef.current = false;
      };
      onScroll();
    },
    [offset],
  );

  return { active, scrollTo };
}
