import { useEffect, useRef } from 'react';

const maxScrollY = 800;

const useScrollFade = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY <= maxScrollY) {
      boxRef.current?.style.setProperty(
        'transform',
        `translateY(${scrollY}px)`,
      );
    }

    if (scrollY >= 0) init();
    if (scrollY >= maxScrollY / 3 - 20) fadeOut(ref0);
    if (scrollY >= maxScrollY / 3 + 20) fadeIn(ref1);
    if (scrollY >= (maxScrollY / 3) * 2 - 20) fadeOut(ref1);
    if (scrollY >= (maxScrollY / 3) * 2 + 20) fadeIn(ref2);
  };

  const init = () => {
    ref0.current?.style.setProperty(
      'transform',
      `translateY(-50%) translateX(-50%)`,
    );
    ref0.current?.style.setProperty('opacity', `1`);
    ref1.current?.style.setProperty(
      'transform',
      `translateY(-60%) translateX(-50%)`,
    );
    ref1.current?.style.setProperty('opacity', `0`);
    ref2.current?.style.setProperty(
      'transform',
      `translateY(-60%) translateX(-50%)`,
    );
    ref2.current?.style.setProperty('opacity', `0`);
  };

  const fadeOut = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.style.setProperty(
      'transform',
      `translateY(-40%) translateX(-50%)`,
    );
    ref.current?.style.setProperty('opacity', `0`);
  };

  const fadeIn = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.style.setProperty(
      'transform',
      `translateY(-50%) translateX(-50%)`,
    );
    ref.current?.style.setProperty('opacity', `1`);
  };

  return { boxRef, ref0, ref1, ref2 };
};

export default useScrollFade;
