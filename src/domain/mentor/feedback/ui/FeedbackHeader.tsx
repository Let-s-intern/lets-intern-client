import mentorConfig from '@/domain/mentor/constants/config';

interface FeedbackHeaderProps {
  challengeTitle?: string;
  missionTh?: number;
  totalCount: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  onClose: () => void;
}

const FeedbackHeader = ({
  challengeTitle,
  missionTh,
  totalCount,
  waitingCount,
  inProgressCount,
  completedCount,
  onClose,
}: FeedbackHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 bg-primary-5 px-4 pb-3 pt-4 md:px-6 md:pt-6">
      {/* 1줄 (모바일: 제목+닫기 / 데스크탑: 제목+통계+가이드+닫기) */}
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-xs font-medium text-neutral-700">
          {challengeTitle ?? '챌린지'} · {missionTh ?? ''}차 피드백
        </span>

        {/* 데스크탑: 통계 뱃지 */}
        <div className="hidden items-center gap-1.5 md:flex">
          <span className="rounded-full px-2 py-0.5 text-xs font-medium text-gray-500">
            총 {totalCount}명
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              waitingCount > 0 ? 'bg-red-50 text-red-500' : 'text-gray-400'
            }`}
          >
            시작 전 {waitingCount}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              inProgressCount > 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
            }`}
          >
            진행 중 {inProgressCount}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              completedCount > 0 ? 'bg-green-50 text-green-700' : 'text-gray-400'
            }`}
          >
            완료 {completedCount}
          </span>
        </div>

        <div className="flex-1" />

        {/* 데스크탑: 가이드 버튼 */}
        <a
          href={mentorConfig.feedbackGuidelineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 md:block"
        >
          피드백 가이드 라인
        </a>

        {/* 닫기 */}
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 text-neutral-500 hover:text-neutral-700"
          aria-label="닫기"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* 2줄 (모바일만: 통계 뱃지) */}
      <div className="flex items-center justify-center gap-1.5 md:hidden">
        <span className="rounded-full px-2 py-0.5 text-xs font-medium text-gray-500">
          총 {totalCount}명
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            waitingCount > 0 ? 'bg-red-50 text-red-500' : 'text-gray-400'
          }`}
        >
          시작 전 {waitingCount}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            inProgressCount > 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
          }`}
        >
          진행 중 {inProgressCount}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            completedCount > 0 ? 'bg-green-50 text-green-700' : 'text-gray-400'
          }`}
        >
          완료 {completedCount}
        </span>
      </div>
    </div>
  );
};

export default FeedbackHeader;
