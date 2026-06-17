import { useEffect, useRef, useState } from 'react';

const scrollEventPage = [
  '/report/landing',
  '/program/challenge',
  '/program/live',
  '/b2b',
];

export default function useScrollDirection(pathname?: string) {
  const lastScrollY = useRef(0);

  const [scrollDirection, setScrollDirection] = useState<string>('UP');

  useEffect(() => {
    const handleScroll = () => {
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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname, setScrollDirection]);

  return scrollDirection;
}
