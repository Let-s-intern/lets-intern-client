'use client';

interface TodayButtonProps {
  /** Whether the today column is currently visible in the viewport */
  isTodayVisible: boolean;
  /** Callback to scroll to today */
  onGoToToday: () => void;
}

/**
 * Floating button that appears when "today" is not visible in the calendar viewport.
 * Clicking it smoothly scrolls the calendar to center today.
 */
const TodayButton = ({ isTodayVisible, onGoToToday }: TodayButtonProps) => {
  if (isTodayVisible) return null;

  return (
    <button
      type="button"
      onClick={onGoToToday}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-primary-hover"
      aria-label="오늘로 이동"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="3"
          width="12"
          height="11"
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M2 6.5H14"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M5.5 2V4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M10.5 2V4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="8" cy="10" r="1.5" fill="currentColor" />
      </svg>
      오늘
    </button>
  );
};

export default TodayButton;
