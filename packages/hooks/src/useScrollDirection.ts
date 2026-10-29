import { useEffect, useRef, useState } from 'react';

const scrollEventPage = [
  '/report/landing',
  '/program/challenge',
  '/program/live',
  '/b2b',
  '/membership',
  '/pass-certification',
  '/mentor-join',
  '/mentor-apply',
];

const isScrollHidePage = (pathname: string) =>
  scrollEventPage.some((page) => pathname.startsWith(page)) ||
  /^\/all-in-one-pass\/[^/]+$/.test(pathname);

export default function useScrollDirection(pathname?: string) {
  const lastScrollY = useRef(0);

  const [scrollDirection, setScrollDirection] = useState<string>('UP');

  useEffect(() => {
    const handleScroll = () => {
      if (pathname && !isScrollHidePage(pathname)) {
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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, setScrollDirection]);

  return scrollDirection;
}
