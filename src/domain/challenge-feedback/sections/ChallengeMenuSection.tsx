import { memo, useCallback } from 'react';
import ChallengeMenuItem from '../components/ChallengeMenuItem';
import { CHALLENGE_LIST } from '../data/challenge-feedback-data';
import type { ChallengeKey } from '../types';

interface ChallengeMenuSectionProps {
  selectedKey: ChallengeKey;
  onSelect: (key: ChallengeKey) => void;
}

const ROW1_KEYS: ChallengeKey[] = [
  'experience',
  'resume',
  'personal-statement',
];
const ROW2_KEYS: ChallengeKey[] = [
  'portfolio',
  'large-corp',
  'marketing',
  'hr',
];

const ChallengeMenuSection = memo(function ChallengeMenuSection({
  selectedKey,
  onSelect,
}: ChallengeMenuSectionProps) {
  const renderRow = useCallback(
    (keys: ChallengeKey[]) =>
      keys.map((key) => {
        const challenge = CHALLENGE_LIST.find((c) => c.key === key);
        if (!challenge) return null;
        return (
          <ChallengeMenuItem
            key={key}
            label={challenge.menuLabel}
            isActive={selectedKey === key}
            onClick={() => onSelect(key)}
          />
        );
      }),
    [selectedKey, onSelect],
  );

  return (
    <section className="flex w-full flex-col items-center justify-center bg-[#110f28] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-8 text-center text-lg font-bold text-white md:mb-12 md:text-3xl">
          어떤 챌린지의 <span className="text-[#B49AFF]">피드백</span>이
          궁금하신가요?
        </h2>
        <div className="flex flex-col items-center gap-2 md:gap-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {renderRow(ROW1_KEYS)}
            {renderRow(ROW2_KEYS.slice(0, 1))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {renderRow(ROW2_KEYS.slice(1))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ChallengeMenuSection;
