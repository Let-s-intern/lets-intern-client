import { useState, type ReactNode } from 'react';

interface FeedbackLayoutProps {
  /** Left panel (mentee list) */
  sidebar: ReactNode;
  /** 경험 등 참고자료 사이드 패널 — 있으면 멘티 목록 자리에 대신 표시 */
  sidePanel?: ReactNode;
  /** 사전 질문 등 오른쪽 참고 패널 — 제출물 패널(왼쪽) 반대편에 표시 */
  rightPanel?: ReactNode;
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
  /** Bottom-left actions (replaces expand button area when provided) */
  leftActions?: ReactNode;
  /** Show expand/collapse toggle button */
  showExpandToggle?: boolean;
  /**
   * 확장 상태 변화 알림 — 모달 컨테이너 크기를 호출처가 바꿀 때 쓴다(전체화면 전환).
   * 미전달 시 확장은 이 컴포넌트 내부에서만 처리되어 기존 동작 그대로다.
   */
  onExpandedChange?: (isExpanded: boolean) => void;
  /**
   * 확장 상태를 바깥에서 제어할 때 전달(controlled). 미전달 시 이 컴포넌트가
   * 내부 state 로 관리한다(기존 동작). 미리보기 카드처럼 토글 버튼 밖에서
   * 확장을 열어야 하는 화면이 controlled 로 쓴다.
   */
  isExpanded?: boolean;
  /**
   * 확장 토글 라벨. 라이브는 확장이 곧 "피드백 작성 화면 열기"라 의미가 달라진다.
   * 미전달 시 "크게 보기 / 작게 보기".
   */
  expandLabel?: string;
  collapseLabel?: string;
  /**
   * 확장 버튼 아이콘 교체 — 라이브는 확장이 "작성 시작"이라 연필이 더 직관적이다.
   * 미전달 시 기본 확대/축소 아이콘.
   */
  expandIcon?: ReactNode;
}

const FeedbackLayout = ({
  sidebar,
  sidePanel,
  rightPanel,
  navigation,
  navigationCompact,
  menteeInfo,
  editor,
  actions,
  leftActions,
  showExpandToggle = true,
  onExpandedChange,
  expandLabel = '크게 보기',
  collapseLabel = '작게 보기',
  expandIcon,
  isExpanded: controlledExpanded,
}: FeedbackLayoutProps) => {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? uncontrolledExpanded;
  const shouldShowCompactNavigation = showExpandToggle && isExpanded;

  // 업데이터 안에서 부모 setState 를 부르면 안 된다(업데이터는 순수해야 하고
  // StrictMode 는 이를 두 번 호출한다). 값을 먼저 계산해 각각 따로 알린다.
  const toggleExpanded = () => {
    const next = !isExpanded;
    if (controlledExpanded === undefined) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };
  // menteeInfo 가 null 이면(예: 라이브 모달은 정보 카드를 editor 로 이동) 빈 래퍼·여백을 렌더하지 않는다.
  const menteeInfoContent = menteeInfo(isExpanded);

  return (
    <div
      className={`flex flex-1 flex-col transition-all duration-300 ease-in-out md:flex-row ${
        isExpanded
          ? 'gap-1 px-2 pb-2 pt-1 md:gap-2 md:px-3 md:pb-3'
          : 'gap-4 px-4 pb-4 pt-2 md:gap-6 md:px-6 md:pb-6'
      }`}
      style={{ height: 'calc(100% - 80px)' }}
    >
      {/* Left panel: 경험 패널이 열리면 멘티 목록 대신 표시 (확장 모드에서도 유지 — 보면서 타이핑) */}
      <div
        className={`flex shrink-0 flex-col transition-all duration-300 ease-in-out ${
          sidePanel
            ? 'max-h-64 opacity-100 md:max-h-none md:w-[360px]'
            : isExpanded
              ? 'max-h-0 overflow-hidden opacity-0 md:max-h-none md:w-0 md:opacity-0'
              : 'max-h-40 opacity-100 md:max-h-none md:w-56'
        }`}
      >
        {sidePanel ?? sidebar}
      </div>

      {/* 가운데 본문(네비게이션·정보카드·에디터·액션) */}
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
        {menteeInfoContent && (
          <div
            className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'mb-0 max-h-14' : 'mb-2 max-h-[500px]'
            }`}
          >
            {menteeInfoContent}
          </div>
        )}

        {/* Feedback editor */}
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
          {editor}
        </div>

        {/* Bottom bar */}
        <div className="flex shrink-0 items-center pt-3">
          {/* 왼쪽: 커스텀 액션 또는 크게 보기 / 작게 보기 */}
          {leftActions ? (
            <div className="flex items-center">{leftActions}</div>
          ) : (
            showExpandToggle && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleExpanded}
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
                    (expandIcon ?? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2.5 6L2.5 2.5L6 2.5M13.5 10L13.5 13.5L10 13.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ))
                  )}
                  {isExpanded ? collapseLabel : expandLabel}
                </button>
              </div>
            )
          )}

          {/* 가운데: 크게 보기 시 작은 네비게이션 */}
          <div
            className={`flex flex-1 items-center justify-center overflow-hidden transition-all duration-300 ease-in-out ${
              shouldShowCompactNavigation
                ? 'max-h-10 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            {navigationCompact}
          </div>

          {/* 기본 모드에서는 빈 공간 */}
          {!shouldShowCompactNavigation && <div className="flex-1" />}

          {/* 오른쪽: 임시저장/제출 */}
          <div className="flex items-center">{actions}</div>
        </div>
      </div>

      {/* 오른쪽 참고 패널(사전 질문) — 열렸을 때만 자리를 차지한다.
          제출물 패널과 달리 대체할 대상이 없어 조건부 렌더한다. */}
      {rightPanel && (
        <div className="flex max-h-64 shrink-0 flex-col opacity-100 transition-all duration-300 ease-in-out md:max-h-none md:w-[320px]">
          {rightPanel}
        </div>
      )}
    </div>
  );
};

export default FeedbackLayout;
