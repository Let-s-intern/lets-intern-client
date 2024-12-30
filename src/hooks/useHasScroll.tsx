import { useEffect, useRef, useState } from 'react';

const throttle = (callback: () => void, delay: number) => {
  let timeId: NodeJS.Timeout | null;

  return () => {
    if (timeId) return;
    timeId = setTimeout(() => {
      callback();
      timeId = null;
    }, delay);
  };
};

/** 스크롤이 있는지 없는지 판단하는 커스텀 훅
 * scrollRef를 스크롤이 생길 수 있는 div element에 전달
 * 스크롤이 생기면 hasScroll을 true로 설정, 아니면 false로 설정
 */
export default function useHasScroll() {
  const scrollRef = useRef<HTMLDivElement>();
  const [hasScroll, setHasScroll] = useState(true);
  const [mounted, setMounted] = useState(false);

  const onResize = () => {
    setHasScroll(
      scrollRef.current?.scrollWidth !== scrollRef.current?.offsetWidth,
    );
  };

  // 랜더링 후 스크롤 길이 체크하도록 보장
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;

    onResize(); // 최초 실행
    window.addEventListener('resize', throttle(onResize, 250));

    return () => {
      window.removeEventListener('resize', throttle(onResize, 250));
    };
  }, [mounted]);

  return { scrollRef, hasScroll };
}
