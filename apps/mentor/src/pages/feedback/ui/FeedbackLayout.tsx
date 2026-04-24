import { useState, type ReactNode } from 'react';

interface FeedbackLayoutProps {
  /** Left panel (mentee list) */
  sidebar: ReactNode;
  /** Prev/next mentee navigation (large) - shown in normal mode top */
  navigation: ReactNode;
  /** Compact prev/next navigation - shown in expanded mode bottom */
  navigationCompact: ReactNode;
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
  navigationCompact,
  menteeInfo,
  editor,
  actions,
}: FeedbackLayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`flex flex-1 flex-col md:flex-row transition-all duration-300 ease-in-out ${
        isExpanded
          ? 'gap-1 px-2 pb-2 pt-1 md:gap-2 md:px-3 md:pb-3'
          : 'gap-4 px-4 pb-4 pt-2 md:gap-6 md:px-6 md:pb-6'
      }`}
      style={{ height: 'calc(100% - 80px)' }}
    >
      {/* Left panel: mentee list */}
      <div
        className={`flex shrink-0 flex-col transition-all duration-300 ease-in-out ${
          isExpanded
            ? 'max-h-0 overflow-hidden opacity-0 md:max-h-none md:w-0 md:opacity-0'
            : 'max-h-40 md:max-h-none md:w-56 opacity-100'
        }`}
      >
        {sidebar}
      </div>

      {/* Right panel */}
      <div
        className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'gap-0' : 'gap-3'
        }`}
      >
        {/* 상단 네비게이션 (기본 모드에서만) */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'
          }`}
        >
          {navigation}
        </div>

        {/* Mentee info */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-14 mb-0' : 'max-h-[500px] mb-2'
          }`}
        >
          {menteeInfo(isExpanded)}
        </div>

        {/* Feedback editor */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {editor}
        </div>

        {/* Bottom bar */}
        <div className="flex shrink-0 items-center border-t border-gray-200 pt-3">
          {/* 왼쪽: 크게 보기 / 작게 보기 (항상 같은 위치) */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800"
          >
            {isExpanded ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 2.5L13.5 2.5L13.5 6M6 13.5L2.5 13.5L2.5 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2.5 6L2.5 2.5L6 2.5M13.5 10L13.5 13.5L10 13.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {isExpanded ? '작게 보기' : '크게 보기'}
          </button>

          {/* 가운데: 크게 보기 시 작은 네비게이션 */}
          <div
            className={`flex flex-1 items-center justify-center overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {navigationCompact}
          </div>

          {/* 기본 모드에서는 빈 공간 */}
          {!isExpanded && <div className="flex-1" />}

          {/* 오른쪽: 임시저장/제출 */}
          <div className="flex items-center">{actions}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLayout;
