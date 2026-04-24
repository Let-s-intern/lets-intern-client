import { memo, useCallback, useEffect, useRef } from 'react';
import StarAnimation from '../components/StarAnimation';

interface HeroSectionProps {
  onScrollDown?: () => void;
}

const HeroSection = memo(function HeroSection({
  onScrollDown,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const passed = useRef(false);

  // 히어로 최상단에 있을 때만 스크롤 가로채기
  useEffect(() => {
    if (!onScrollDown) return;

    const handleWheel = (e: WheelEvent) => {
      // 이미 히어로를 지났으면 일반 스크롤
      if (passed.current) return;

      // 페이지 최상단(히어로 영역)에 있을 때만 가로채기
      if (window.scrollY > 10) {
        passed.current = true;
        return;
      }

      if (e.deltaY > 0) {
        e.preventDefault();
        passed.current = true;
        onScrollDown();
      }
    };

    const handleScroll = () => {
      // 최상단으로 돌아오면 다시 snap 활성화
      if (window.scrollY <= 10) {
        passed.current = false;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollDown]);

  const handleClick = useCallback(() => {
    onScrollDown?.();
  }, [onScrollDown]);

  return (
    <section
      ref={sectionRef}
      onClick={handleClick}
      className="relative flex h-[calc(100vh-84px)] w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a1145] via-[#0f0d2e] to-[#0C0A1D] md:h-[calc(100vh-116px)]"
    >
      <StarAnimation />

      {/* 좌우 서류 아이콘 장식 */}
      <div className="pointer-events-none absolute left-4 top-8 text-4xl opacity-20 md:left-12 md:text-6xl">
        <span className="inline-block -rotate-12">📄</span>
      </div>
      <div className="pointer-events-none absolute right-4 top-12 text-3xl opacity-20 md:right-12 md:text-5xl">
        <span className="inline-block rotate-12">📄</span>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 text-center">
        <p className="text-sm font-medium tracking-wide text-[#B49AFF] md:text-lg">
          렛츠커리어 현직자 멘토단과 함께하는
        </p>
        <h1 className="mt-4 text-2xl font-bold leading-tight text-white md:mt-6 md:text-5xl lg:text-[3.5rem]">
          혼자 준비하는 취업은 이제 그만,
        </h1>
        <p className="mt-2 text-3xl font-extrabold text-[#B49AFF] md:mt-3 md:text-6xl lg:text-[4.5rem]">
          현직자와 함께
        </p>
        <p className="mt-6 text-sm leading-relaxed text-gray-400 md:mt-8 md:text-lg">
          대기업 · IT 대기업 · 시리즈 B 이상 스타트업 현직자들이
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-200 md:text-lg">
          여러분의 서류를 직접 진단합니다
        </p>
      </div>

      {/* 스크롤 유도 */}
      <div className="absolute bottom-10 flex flex-col items-center gap-2">
        <span className="text-xs tracking-widest text-gray-400">SCROLL</span>
        <div className="flex animate-bounce flex-col items-center text-gray-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 10l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
