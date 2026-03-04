'use client';

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
  const baseClass =
    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors';
  const activeClass = 'border-orange-400 bg-orange-50 text-orange-700';
  const inactiveClass =
    'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-neutral-700">
        참여중인 챌린지
      </span>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`${baseClass} ${selectedChallengeId === null ? activeClass : inactiveClass}`}
      >
        전체
      </button>
      {challenges.map((c) => (
        <button
          key={c.challengeId}
          type="button"
          onClick={() => onSelect(c.challengeId)}
          className={`${baseClass} ${selectedChallengeId === c.challengeId ? activeClass : inactiveClass}`}
        >
          {c.title}
        </button>
      ))}
    </div>
  );
};

export default ChallengeFilter;
