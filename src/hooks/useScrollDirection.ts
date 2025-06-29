import { useEffect, useRef, useState } from 'react';

const scrollEventPage = [
  '/report/landing',
  '/program/challenge',
  '/program/live',
];

export default function useScrollDirection(pathname?: string) {
  const lastScrollY = useRef(0);

  const [scrollDirection, setScrollDirection] = useState<string>();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      // 현재 경로가 scrollEventPage 중 하나로 시작되지 않을 때는 스크롤 이벤트를 무시
      if (
        pathname &&
        !scrollEventPage.some((page) => pathname.startsWith(page))
      ) {
        return;
      }

      const currentScrollY = Math.max(0, window.scrollY);

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('DOWN');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('UP');
      }

      lastScrollY.current = currentScrollY;
    };

    setScrollDirection('UP');
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, setScrollDirection]);

  return scrollDirection;
}
