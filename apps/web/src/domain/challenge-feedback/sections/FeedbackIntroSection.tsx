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

  const isSingle = challenge.feedbackOptions.length === 1;

  return (
    <section className="w-full bg-[#0e0c22] py-20 md:py-28">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* 챌린지 제목 */}
        <h2 className="mb-10 text-center text-lg font-bold text-white md:mb-14 md:text-2xl">
          {challenge.fullName}
        </h2>

        {/* 옵션 카드 */}
        <div
          className={
            isSingle
              ? 'mx-auto max-w-[600px]'
              : 'grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8'
          }
        >
          {challenge.feedbackOptions.map((option) => (
            <FeedbackOptionCard key={option.tier} option={option} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default FeedbackIntroSection;
