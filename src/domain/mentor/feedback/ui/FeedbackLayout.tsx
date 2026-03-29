import { useState, type ReactNode } from 'react';

interface FeedbackLayoutProps {
  /** Left panel (mentee list) */
  sidebar: ReactNode;
  /** Prev/next mentee navigation - compact version for bottom bar */
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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        {/* Mentee info - collapsible */}
        <div className="shrink-0">
          {menteeInfo(isCollapsed)}
        </div>

        {/* Feedback editor - flex-1 to fill remaining height */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {editor}
        </div>

        {/* Bottom bar: 크게보기 | 이전/다음 멘티 | 임시저장/제출 */}
        <div className="flex shrink-0 items-center border-t border-gray-200 pt-3">
          {/* 왼쪽: 크게 보기 */}
          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className={isCollapsed ? 'rotate-180' : ''}
            >
              <path
                d={isCollapsed
                  ? 'M3 10L8 5L13 10'
                  : 'M3 6L8 11L13 6'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isCollapsed ? '멘티 정보 보기' : '크게 보기'}
          </button>

          {/* 가운데: 이전/다음 멘티 */}
          <div className="flex flex-1 items-center justify-center">
            {navigation}
          </div>

          {/* 오른쪽: 임시저장/제출 */}
          <div className="flex items-center">{actions}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLayout;
