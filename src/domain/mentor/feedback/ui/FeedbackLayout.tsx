import { useState, type ReactNode } from 'react';

interface FeedbackLayoutProps {
  /** Left panel (mentee list) */
  sidebar: ReactNode;
  /** Prev/next mentee navigation */
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`flex flex-1 flex-col md:flex-row transition-all duration-300 ease-in-out ${
        isExpanded
          ? 'gap-1 px-2 pb-2 pt-1 md:gap-2 md:px-3 md:pb-3'
          : 'gap-4 px-4 pb-4 pt-2 md:gap-6 md:px-6 md:pb-6'
      }`}
      style={{ height: 'calc(100% - 72px)' }}
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

      {/* Right panel: editor area */}
      <div
        className={`flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'gap-1' : 'gap-3'
        }`}
      >
        {/* 크게 보기 시 상단 바: 축소 버튼 + 네비게이션 */}
        <div
          className={`flex shrink-0 items-center overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'max-h-12 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 10L8 5L13 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            축소
          </button>
          <div className="flex flex-1 items-center justify-center">
            {navigation}
          </div>
        </div>

        {/* Mentee info - collapsible with animation */}
        <div
          className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'max-h-14 opacity-100'
              : 'max-h-[500px] opacity-100'
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
          {/* 크게 보기 버튼 (기본 상태에서만) */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isExpanded
                ? 'w-0 overflow-hidden opacity-0'
                : 'opacity-100'
            }`}
          >
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-1 whitespace-nowrap text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 6L8 11L13 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              크게 보기
            </button>
          </div>

          {/* 네비게이션 (기본 상태에서만) */}
          <div
            className={`flex flex-1 items-center justify-center transition-all duration-300 ease-in-out ${
              isExpanded ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {isExpanded ? null : navigation}
          </div>

          {/* 임시저장/제출 */}
          <div className="flex items-center">{actions}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLayout;
