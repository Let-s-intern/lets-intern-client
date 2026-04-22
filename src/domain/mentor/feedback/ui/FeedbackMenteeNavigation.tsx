interface FeedbackMenteeNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  compact?: boolean;
}

const FeedbackMenteeNavigation = ({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  compact = false,
}: FeedbackMenteeNavigationProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 9L10 13L14 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          이전 멘티
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          다음 멘티
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M10 9L14 13L10 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev}
        className="flex items-center gap-1 px-4 py-2 text-base font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M14 9L10 13L14 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        이전 멘티
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        className="flex items-center gap-1 px-4 py-2 text-base font-medium text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        다음 멘티
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M10 9L14 13L10 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default FeedbackMenteeNavigation;
