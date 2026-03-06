'use client';

import { twMerge } from '@/lib/twMerge';

interface ChallengeFilterProps {
  challenges: { challengeId: number; title: string }[];
  selectedChallengeId: number | null;
  onSelect: (challengeId: number | null) => void;
}

const ChallengeFilter = ({
  challenges,
  selectedChallengeId,
  onSelect,
}: ChallengeFilterProps) => {
  return (
    <div className="inline-flex items-center gap-4">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={twMerge(
          'rounded-md border border-neutral-200 bg-white px-3 py-[5px] text-sm leading-5',
          selectedChallengeId === null
            ? 'font-normal text-primary-dark'
            : 'font-normal text-neutral-500',
        )}
      >
        전체
      </button>
      {challenges.map((c) => (
        <button
          key={c.challengeId}
          type="button"
          onClick={() => onSelect(c.challengeId)}
          className={twMerge(
            'rounded-md border border-neutral-200 bg-white px-3 py-[5px] text-sm leading-5',
            selectedChallengeId === c.challengeId
              ? 'font-normal text-primary-dark'
              : 'font-normal text-neutral-500',
          )}
        >
          {c.title}
        </button>
      ))}
    </div>
  );
};

export default ChallengeFilter;
