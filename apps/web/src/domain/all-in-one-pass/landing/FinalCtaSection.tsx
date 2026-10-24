'use client';

import SolidButton from '@/common/button/SolidButton';
import clsx from 'clsx';
import LandingCountdown from './LandingCountdown';
import type { LandingDescription } from './landingContent';

interface Props {
  passTitle: string;
  finalCta: LandingDescription['finalCta'];
  deadline: string | null;
  ctaText: string;
  ctaDisabled: boolean;
  onStart: () => void;
}

/** 랜딩 마지막 CTA — 마감 임박 배지 + 카운트다운 + 신청 버튼 (어두운 배경). */
export default function FinalCtaSection({
  passTitle,
  finalCta,
  deadline,
  ctaText,
  ctaDisabled,
  onStart,
}: Props) {
  const title = finalCta.title?.trim() || `${passTitle}, 지금 바로 시작하세요`;
  const description =
    finalCta.description?.trim() ||
    '선착순 마감 전에 합류하고, 취준에 필요한 모든 준비를 한 번에 끝내세요.';

  return (
    <section
      className="px-5 py-16 text-center text-white md:py-24"
      style={{
        background:
          'linear-gradient(279deg, rgba(0, 0, 0, 0.50) 0.01%, rgba(39, 39, 45, 0.32) 100.01%), #4138A3',
      }}
    >
      <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-6 md:gap-8">
        <span className="text-xsmall14 rounded-full bg-[#F36D32] px-5 py-2 font-bold">
          선착순 마감 임박
        </span>
        <h2 className="text-xlarge28 whitespace-pre-line font-bold leading-snug md:text-[40px]">
          {title}
        </h2>
        <p className="text-xsmall14 md:text-small18 whitespace-pre-line text-white/70">
          {description}
        </p>

        {!ctaDisabled && deadline && (
          <div className="w-full max-w-[460px]">
            <LandingCountdown deadline={deadline} variant="dark" />
          </div>
        )}

        <SolidButton
          size="xl"
          onClick={onStart}
          disabled={ctaDisabled}
          className={clsx(
            'text-small18 mt-2 w-full rounded-sm font-bold md:w-[234px]',
            ctaDisabled ? 'bg-[#F9B68F]' : 'bg-[#F36D32] hover:bg-[#E15D28]',
          )}
        >
          {ctaText}
        </SolidButton>
      </div>
    </section>
  );
}
