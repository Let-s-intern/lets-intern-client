import { useEffect, useRef, useState } from 'react';

const scrollEventPage = [
  '/report/landing',
  '/program/challenge',
  '/program/live',
  '/category',
  '/b2b',
  '/membership',
  '/pass-certification',
  '/mentor-join',
  '/mentor-apply',
  '/bigfirm',
  '/letscon', // [LETSCON] 행사 종료 후 삭제
];

/** 이보다 작은 스크롤 변화는 방향 전환으로 보지 않는다 (px) */
const SCROLL_DIRECTION_THRESHOLD = 6;

const isScrollHidePage = (pathname: string) =>
  scrollEventPage.some((page) => pathname.startsWith(page)) ||
  /^\/all-in-one-pass\/[^/]+$/.test(pathname);

export default function useScrollDirection(pathname?: string) {
  const lastScrollY = useRef(0);

  const [scrollDirection, setScrollDirection] = useState<string>('UP');

  useEffect(() => {
    // 헤더는 페이지를 옮겨도 그대로 살아 있어서 방향 상태가 이전 페이지 값을 들고 온다.
    // 아래로 스크롤해 'DOWN' 이 된 채 숨김 대상이 아닌 페이지로 가면 handleScroll 이 곧바로
    // 돌아 나가 'UP' 으로 돌아올 길이 없어 헤더가 숨은 채 남았다. 그런 페이지에서는 되돌린다.
    if (pathname && !isScrollHidePage(pathname)) {
      setScrollDirection('UP');
    }
    lastScrollY.current = Math.max(0, window.scrollY);

    const handleScroll = () => {
      if (pathname && !isScrollHidePage(pathname)) {
        return;
      }

      const currentScrollY = Math.max(0, window.scrollY);

      // 부드러운 이동이 끝나갈 때나 레이아웃이 밀릴 때의 1~몇 px 되돌림으로 방향이 뒤집혀
      // 헤더와 탭이 위아래로 출렁였다. 맨 위가 아니면 이만큼 움직여야 방향을 바꾼다.
      if (
        currentScrollY > 0 &&
        Math.abs(currentScrollY - lastScrollY.current) <
          SCROLL_DIRECTION_THRESHOLD
      ) {
        return;
      }

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('DOWN');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('UP');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, setScrollDirection]);

  return scrollDirection;
}
