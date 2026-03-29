import { useState, type ReactNode } from 'react';

interface FeedbackLayoutProps {
  /** Left panel (mentee list) */
  sidebar: ReactNode;
  /** Navigation buttons (prev/next mentee) */
  navigation: ReactNode;
  /** Mentee info card - receives (collapsed: boolean) => ReactNode */
  menteeInfo: (collapsed: boolean) => ReactNode;
  /** Feedback editor */
  editor: ReactNode;
  /** Action buttons */
  actions: ReactNode;
}

const FeedbackLayout = ({
  sidebar,
  navigation,
  menteeInfo,
  editor,
  actions,
}: FeedbackLayoutProps) => {
  const [isMenteeInfoOpen, setIsMenteeInfoOpen] = useState(true);

  return (
    <div
      className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-2 md:flex-row md:gap-6 md:px-6 md:pb-6"
      style={{ height: 'calc(100% - 72px)' }}
    >
      {/* Left panel: mentee list */}
      <div className="flex max-h-40 shrink-0 flex-col md:max-h-none md:w-56">
        {sidebar}
      </div>

      {/* Right panel: editor area - takes remaining space */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
        {/* Navigation */}
        <div className="shrink-0">{navigation}</div>

        {/* Mentee info - collapsible */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setIsMenteeInfoOpen((prev) => !prev)}
            className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            멘티 정보
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className={`transition-transform ${isMenteeInfoOpen ? 'rotate-180' : ''}`}
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {menteeInfo(!isMenteeInfoOpen)}
        </div>

        {/* Feedback editor - flex-1 to fill remaining height */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {editor}
        </div>

        {/* Actions */}
        <div className="shrink-0">{actions}</div>
      </div>
    </div>
  );
};

export default FeedbackLayout;
