'use client';

interface MenteePreQuestionPanelProps {
  onClose: () => void;
  preQuestion?: string | null;
  menteeName?: string;
}

/**
 * 피드백 모달 오른쪽 영역에 표시되는 멘티 사전 질문 패널.
 * 제출물 패널(왼쪽)과 반대편에 두어 둘을 동시에 참조하며 피드백을 쓸 수 있다.
 *
 * 정보 카드에 인라인으로 두면 장문일 때 카드가 제한 없이 늘어나 에디터를 밀어낸다
 * (모달은 높이 고정·스크롤 없음이라 에디터만 줄어든다). 패널은 높이가 고정이고
 * 내부에서만 스크롤되므로 에디터 높이를 침범하지 않는다.
 */
const MenteePreQuestionPanel = ({
  onClose,
  preQuestion,
  menteeName,
}: MenteePreQuestionPanelProps) => {
  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-gray-200">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-2.5">
        <h4 className="truncate text-sm font-semibold text-neutral-900">
          {menteeName ? `${menteeName} 님의 ` : ''}사전 질문
        </h4>
        <button
          type="button"
          onClick={onClose}
          aria-label="사전 질문 패널 닫기"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {hasPreQuestion ? (
          <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">
            {preQuestion}
          </p>
        ) : (
          <p className="text-sm text-neutral-400">
            작성한 사전 질문이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default MenteePreQuestionPanel;
