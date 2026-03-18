import { memo } from 'react';
import StarAnimation from '../components/StarAnimation';

const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#1a1145] via-[#0f0d2e] to-[#0C0A1D] py-20 md:py-28">
      <StarAnimation />

      {/* 좌우 서류 아이콘 장식 */}
      <div className="pointer-events-none absolute left-4 top-8 text-4xl opacity-20 md:left-12 md:text-6xl">
        <span className="-rotate-12 inline-block">📄</span>
      </div>
      <div className="pointer-events-none absolute right-4 top-12 text-3xl opacity-20 md:right-12 md:text-5xl">
        <span className="rotate-12 inline-block">📄</span>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 text-center">
        <p className="text-sm font-medium tracking-wide text-[#B49AFF] md:text-base">
          렛츠커리어 현직자 멘토단과 함께하는
        </p>
        <h1 className="mt-4 text-2xl font-bold leading-tight text-white md:mt-6 md:text-4xl lg:text-[2.75rem]">
          혼자 준비하는 취업은 이제 그만,
        </h1>
        <p className="mt-2 text-3xl font-extrabold text-[#B49AFF] md:mt-3 md:text-5xl lg:text-[3.5rem]">
          현직자와 함께
        </p>
        <p className="mt-6 text-sm leading-relaxed text-gray-400 md:mt-8 md:text-base">
          대기업 · IT 대기업 · 시리즈 B 이상 스타트업 현직자들이
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-200 md:text-base">
          여러분의 서류를 직접 진단합니다
        </p>
      </div>
    </section>
  );
});

export default HeroSection;
