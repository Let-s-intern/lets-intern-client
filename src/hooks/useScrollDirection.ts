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
      // todo:
      // useScrollDirection 훅은 순수하게 스크롤 방향만 제공하고,
      // 페이지별 필터링 로직은 NextNavBar와 같은 개별 컴포넌트에서 처리하는 것이
      // 더 명확하고 응집도 높은 설계가 될 것입니다.

      // 현재 경로가 scrollEventPage 중 하나로 시작되지 않을 때는 스크롤 이벤트를 무시
      if (
        pathname &&
        !scrollEventPage.some((page) => pathname.startsWith(page))
      ) {
        return;
      }

      // pathname을 넘기지 않아도 scrollDirection 지정
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
