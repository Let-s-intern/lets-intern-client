import { useEffect, useState, type RefObject } from 'react';

// 모바일 가로 scroll-snap 캐러셀의 활성 슬라이드 추적 + 도트 이동.
// 트랙(ref)의 직계 자식이 슬라이드다. 데스크톱(가로 스크롤 없음)에서는
// 도트가 CSS 로 숨겨지고 옵저버 결과도 쓰이지 않아 무해하다.
export function useCarouselDots(trackRef: RefObject<HTMLElement | null>) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    if (!slides.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = slides.indexOf(entry.target as HTMLElement);
          if (idx !== -1) setActiveIndex(idx);
        });
      },
      { root: track, threshold: 0.6 },
    );
    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [trackRef]);

  const scrollToSlide = (i: number) => {
    const slide = trackRef.current?.children[i] as HTMLElement | undefined;
    if (!slide) return;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    slide.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return { activeIndex, scrollToSlide };
}
