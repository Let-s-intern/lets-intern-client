'use client';

import { ArrowRight } from 'lucide-react';
import LandingCountdown from './LandingCountdown';
import type { LandingDescription } from './landingContent';

interface Props {
  hero: LandingDescription['hero'];
  periodDays: number | null;
  deadline: string | null;
  ctaText: string;
  ctaDisabled: boolean;
  onStart: () => void;
  onScrollToBenefit: () => void;
}

/** 시안 1 — 히어로. 좌: 카피+CTA / 우: 선착순 모집 카드(카운트다운). */
export default function HeroSection({
  hero,
  periodDays,
  deadline,
  ctaText,
  ctaDisabled,
  onStart,
  onScrollToBenefit,
}: Props) {
  const badge = periodDays
    ? `구매 시점부터 ${periodDays}일 이용 가능`
    : '지금 바로 이용 가능';

  return (
    <section className="bg-gradient-to-br from-white/30 to-[#3378E0]/30">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-8 px-5 py-14 md:flex-row md:items-center md:gap-12 md:px-0 md:py-20">
        <div className="md:gap-15 flex flex-1 flex-col gap-8 md:min-h-[445px] md:justify-between">
          <div className="flex flex-col gap-4 md:gap-8">
            <span className="bg-static-100 text-xxsmall12 md:text-xsmall14 mb-4 w-fit rounded-full px-5 py-2 font-semibold text-[#F36D32] md:mb-0 md:px-6 md:py-3">
              {badge}
            </span>
            <h1 className="text-xlarge28 text-neutral-0 whitespace-pre-line font-extrabold leading-[38px] md:text-[44px] md:leading-[62px]">
              {hero.title}
            </h1>
            <p className="text-xsmall14 md:text-small20 text-neutral-35 whitespace-pre-line">
              {hero.description}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-5">
            <button
              type="button"
              onClick={onStart}
              disabled={ctaDisabled}
              className="text-xsmall16 md:text-small20 disabled:bg-neutral-70 w-full rounded-sm bg-[#F36D32] px-4 py-3 font-semibold text-neutral-100 md:w-[280px] md:px-9 md:py-5"
            >
              {ctaText}
            </button>
            <button
              type="button"
              onClick={onScrollToBenefit}
              className="text-xsmall16 md:text-small20 flex w-full items-center justify-center gap-1 px-4 py-3 text-center font-semibold text-[#4A76FF] md:w-[280px] md:px-9 md:py-5"
            >
              혜택 먼저 보기
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-1.5 rounded-[28px] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] md:w-[360px] md:px-[30px] md:py-6">
          <p className="text-xsmall16 font-semibold text-[#F36D32]">
            🔥 선착순 100명 한정 모집
          </p>
          <p className="text-medium24 md:text-xlarge28 text-neutral-0 font-bold">
            시즌 혜택 마감까지
          </p>
          <div className="mt-3">
            <LandingCountdown deadline={deadline} />
          </div>
          {hero.recruitFootnote && (
            <p className="text-xsmall14 text-neutral-40 mt-4">
              {hero.recruitFootnote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
