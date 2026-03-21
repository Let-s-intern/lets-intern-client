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
    <section className="w-full bg-[#0C0A1D] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* 모바일: 세로 스택 / 데스크톱: 나란히 배치 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {challenge.feedbackOptions.map((option) => (
            <FeedbackOptionCard key={option.tier} option={option} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default FeedbackIntroSection;
