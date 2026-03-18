import { memo, useCallback } from 'react';
import ChallengeMenuItem from '../components/ChallengeMenuItem';
import { CHALLENGE_LIST } from '../data/challenge-feedback-data';
import type { ChallengeKey } from '../types';

interface ChallengeMenuSectionProps {
  selectedKey: ChallengeKey;
  onSelect: (key: ChallengeKey) => void;
}

const ROW1_KEYS: ChallengeKey[] = ['experience', 'resume', 'personal-statement'];
const ROW2_KEYS: ChallengeKey[] = ['portfolio', 'large-corp', 'marketing', 'hr'];

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
    <section className="w-full bg-[#0C0A1D] py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="mb-8 text-center text-xl font-bold text-[#B49AFF] md:mb-12 md:text-2xl">
          어떤 챌린지의 피드백이 궁금하신가요?
        </h2>
        {/* 데스크톱: 2줄 배치 / 모바일: wrap */}
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {renderRow(ROW1_KEYS)}
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {renderRow(ROW2_KEYS)}
          </div>
        </div>
      </div>
    </section>
  );
});

export default ChallengeMenuSection;
