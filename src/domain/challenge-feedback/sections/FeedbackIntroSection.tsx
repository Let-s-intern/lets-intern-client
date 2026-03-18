import { memo } from 'react';
import FeedbackOptionCard from '../components/FeedbackOptionCard';
import type { ChallengeData } from '../types';

interface FeedbackIntroSectionProps {
  challenge: ChallengeData;
}

const FeedbackIntroSection = memo(function FeedbackIntroSection({
  challenge,
}: FeedbackIntroSectionProps) {
  if (challenge.feedbackOptions.length === 0) return null;

  return (
    <section className="w-full bg-[#0C0A1D] py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* 모바일: 세로 스택 / 데스크톱: 좌 sticky + 우 스크롤 */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          {/* 좌측: 리포트 카드 — sticky */}
          <div className="lg:sticky lg:top-24 lg:w-5/12 lg:self-start">
            <div className="mx-auto w-full max-w-[480px] rounded-lg border border-[#7C6BFF]/30 bg-gradient-to-br from-[#1a1145] to-[#0f0d2e] p-8 text-center shadow-[0_0_40px_rgba(124,107,255,0.15)]">
              <p className="text-xs text-gray-400">
                서류완성의 시작과 끝은 진단에서부터
              </p>
              <h3 className="mt-4 text-xl font-bold text-white md:text-2xl">
                {challenge.fullName}
                <br />
                서류 피드백 REPORT
              </h3>
              <div className="mt-8 space-y-3">
                <p className="inline-block rounded-full bg-[#7C6BFF]/20 px-4 py-1.5 text-xs font-medium text-[#B49AFF]">
                  3,000명의 데이터를 보유한
                </p>
                <p className="text-sm font-medium text-[#B49AFF]">
                  취업 연구팀, 현직자 피드백으로
                </p>
                <p className="text-lg font-bold text-white">
                  서류 합격률 200% 고공 상승!
                </p>
              </div>
            </div>
          </div>

          {/* 우측: STANDARD / PREMIUM 옵션 카드 */}
          <div className="flex flex-col gap-6 lg:w-7/12">
            {challenge.feedbackOptions.map((option) => (
              <FeedbackOptionCard key={option.tier} option={option} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default FeedbackIntroSection;
