import { useEffect, useRef, useState } from 'react';

const useScrollShadow = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollTop, setIsScrollTop] = useState(false);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (clientHeight >= scrollHeight) {
          setIsScrollTop(true);
          setIsScrollEnd(true);
        } else if (scrollTop === 0) {
          setIsScrollTop(true);
          setIsScrollEnd(false);
        } else if (scrollTop + clientHeight >= scrollHeight) {
          setIsScrollTop(false);
          setIsScrollEnd(true);
        } else {
          setIsScrollEnd(false);
          setIsScrollTop(false);
        }
      }
    };

    checkScroll();

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
    }
    window.addEventListener('resize', checkScroll);

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [scrollRef]);

  return { scrollRef, isScrollTop, isScrollEnd };
};

export default useScrollShadow;
