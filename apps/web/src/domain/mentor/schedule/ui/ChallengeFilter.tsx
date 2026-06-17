'use client';

import { twMerge } from '@/lib/twMerge';
import ChallengeTag from '../weekly-calendar/ui/ChallengeTag';

interface ChallengeFilterItem {
  challengeId: number;
  title: string;
  colorIndex: number;
}

interface ChallengeFilterProps {
  challenges: ChallengeFilterItem[];
  selectedChallengeId: number | null;
  onSelect: (challengeId: number | null) => void;
}

const ChallengeFilter = ({
  challenges,
  selectedChallengeId,
  onSelect,
}: ChallengeFilterProps) => {
  const handleToggle = (challengeId: number) => {
    onSelect(challengeId);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={twMerge(
          'rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium leading-5 transition-colors',
          selectedChallengeId === null
            ? 'border-primary bg-primary text-white'
            : 'text-neutral-500 hover:bg-neutral-50',
        )}
      >
        전체
      </button>
      {challenges.map((c) => (
        <ChallengeTag
          key={c.challengeId}
          challengeId={c.challengeId}
          title={c.title}
          colorIndex={c.colorIndex}
          isSelected={selectedChallengeId === c.challengeId}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

export default ChallengeFilter;
