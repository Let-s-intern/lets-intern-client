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
        <h2 className="mb-8 text-center text-2xl font-bold text-white md:mb-12 md:text-3xl">
          어떤 챌린지의 <span className="text-[#B49AFF]">피드백</span>이
          궁금하신가요?
        </h2>
        {/* 모바일: 그리드 균등 배치 / 데스크톱: flex 2줄 배치 */}
        <div className="flex flex-col items-center gap-3 md:gap-6">
          <div className="grid w-full grid-cols-3 gap-2 md:flex md:flex-wrap md:justify-center md:gap-4">
            {renderRow(ROW1_KEYS)}
          </div>
          <div className="grid w-full grid-cols-4 gap-2 md:flex md:flex-wrap md:justify-center md:gap-4">
            {renderRow(ROW2_KEYS)}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ChallengeMenuSection;
