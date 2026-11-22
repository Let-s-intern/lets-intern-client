import { useEffect, useRef } from 'react';

/**
 * 목록 끝 표시. 화면에 가까워지면 onVisible 을 부른다 (무한 스크롤).
 * 부르는 쪽에서 key 를 바꿔 다시 붙이면, 한 번 더 불러와도 화면이 덜 찼을 때 이어서 부른다
 */
const LoadMoreSentinel = ({ onVisible }: { onVisible: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const callback = useRef(onVisible);
  callback.current = onVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback.current();
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} aria-hidden className="h-px w-full" />;
};

export default LoadMoreSentinel;
