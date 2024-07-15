import { useEffect, useRef } from 'react';

interface UseScrollFadeProps {
  isScroll: boolean;
  setIsScroll: (isScroll: boolean) => void;
}

const useScrollFade = ({ isScroll, setIsScroll }: UseScrollFadeProps) => {
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
    const maxScrollY =
      document.documentElement.scrollHeight - window.innerHeight; // 스크롤 최대값
    const scrollY = window.scrollY;

    if (!isScroll && scrollY >= 0) init();
    if (!isScroll && scrollY >= maxScrollY / 3 - 20) fadeOut(ref0);
    if (!isScroll && scrollY >= maxScrollY / 3 + 20) fadeIn(ref1);
    if (!isScroll && scrollY >= (maxScrollY / 3) * 2 - 20) fadeOut(ref1);
    if (!isScroll && scrollY >= (maxScrollY / 3) * 2 + 20) fadeIn(ref2);
    if (!isScroll && scrollY >= maxScrollY - 10) startScroll();
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

  const startScroll = () => {
    setIsScroll(true);
    window.scrollTo({ top: 0, left: 0 });
    window.removeEventListener('scroll', handleScroll);
  };

  return { ref0, ref1, ref2 };
};

export default useScrollFade;
