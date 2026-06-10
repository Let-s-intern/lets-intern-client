'use client';

import MenteeExperienceContent from './MenteeExperienceContent';

interface MenteeExperiencePanelProps {
  onClose: () => void;
  missionId?: number;
  userId?: number | null;
  menteeName?: string;
}

/**
 * 피드백 모달 왼쪽 영역에 표시되는 경험정리 제출물 패널.
 * 에디터를 보면서 타이핑할 수 있도록 멘티 목록 자리에 띄운다.
 */
const MenteeExperiencePanel = ({
  onClose,
  missionId,
  userId,
  menteeName,
}: MenteeExperiencePanelProps) => {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-gray-200">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-3 py-2.5">
        <h4 className="truncate text-sm font-semibold text-neutral-900">
          {menteeName ? `${menteeName} 님의 ` : ''}제출 경험
        </h4>
        <button
          type="button"
          onClick={onClose}
          aria-label="경험 패널 닫기"
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
        <MenteeExperienceContent
          missionId={missionId}
          userId={userId}
          compact
        />
      </div>
    </div>
  );
};

export default MenteeExperiencePanel;
