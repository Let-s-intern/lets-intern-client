import { twMerge } from '@/lib/twMerge';

import { statusBadgeOrMuted } from '@/constants/statusColors';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

interface FeedbackHeaderProps {
  challengeTitle?: string;
  missionTh?: number;
  totalCount: number;
  waitingCount: number;
  inProgressCount: number;
  completedCount: number;
  /**
   * LIVE 피드백 모달에서만 사용하는 4번째 카운터 ("미진행").
   * 서면 피드백 모달은 이 prop을 넘기지 않으므로 미렌더.
   */
  missedCount?: number;
  /**
   * LIVE 피드백 모달 전용 5번째 카운터 ("취소" — 예약 후 미제출·예약취소).
   * 서면 피드백 모달은 이 prop을 넘기지 않으므로 미렌더.
   */
  cancelledCount?: number;
  /** 헤더 좌상단 회차 라벨을 "LIVE 피드백"으로 표시 (디자인 image copy 3.png). */
  isLive?: boolean;
  onClose: () => void;
}

/**
 * 피드백 모달/페이지 상단 바.
 *
 * PRD-0503 #4: 챌린지별 색상 구분 제거 — 단일 primary-5 배경으로 통일.
 */
const FeedbackHeader = ({
  challengeTitle,
  missionTh,
  totalCount,
  waitingCount,
  inProgressCount,
  completedCount,
  missedCount,
  cancelledCount,
  isLive = false,
  onClose,
}: FeedbackHeaderProps) => {
  const sessionSuffix = isLive ? 'LIVE 피드백' : '서면 피드백';
  // 서면(isLive=false)은 "진행 전 / 진행 중 / 승인 완료", 라이브는 진리표 4종 라벨로 통일.
  const waitingLabel = isLive ? '진행 예정' : '진행 전';
  const completedLabel = isLive ? '진행 완료' : '승인 완료';
  const missedLabel = '미진행';
  // 라이브는 캘린더 4상태 팔레트(indigo/blue/neutral/red)로 통일. 서면은 기존 유지.
  const waitingKey = isLive ? 'liveWaiting' : 'waiting';
  const completedKey = isLive ? 'liveCompleted' : 'completed';
  const missedKey = isLive ? 'liveMissed' : 'absent';
  return (
    <div className="flex flex-col gap-2 bg-white px-4 pb-3 pt-4 md:px-6 md:pt-6">
      {/* 1줄 (모바일: 제목+닫기 / 데스크탑: 제목+통계+가이드+닫기) */}
      <div className="flex items-center gap-3">
        <span className="shrink-0 text-xs font-medium text-neutral-700">
          {challengeTitle ?? '챌린지'} · {missionTh ?? ''}차 {sessionSuffix}
        </span>

        {/* 데스크탑: 통계 뱃지 (우측 정렬) */}
        <div className="hidden flex-1 items-center justify-end gap-1.5 md:flex">
          <span
            className={twMerge(feedbackModalDesign.headerChip, 'text-gray-500')}
          >
            총 {totalCount}명
          </span>
          <span
            className={twMerge(
              feedbackModalDesign.headerChip,
              statusBadgeOrMuted(waitingCount, waitingKey),
            )}
          >
            {waitingLabel} {waitingCount}
          </span>
          <span
            className={twMerge(
              feedbackModalDesign.headerChip,
              statusBadgeOrMuted(inProgressCount, 'inProgress'),
            )}
          >
            진행 중 {inProgressCount}
          </span>
          <span
            className={twMerge(
              feedbackModalDesign.headerChip,
              statusBadgeOrMuted(completedCount, completedKey),
            )}
          >
            {completedLabel} {completedCount}
          </span>
          {missedCount !== undefined && (
            <span
              className={twMerge(
                feedbackModalDesign.headerChip,
                statusBadgeOrMuted(missedCount, missedKey),
              )}
            >
              {missedLabel} {missedCount}
            </span>
          )}
          {cancelledCount !== undefined && (
            <span
              className={twMerge(
                feedbackModalDesign.headerChip,
                statusBadgeOrMuted(cancelledCount, 'liveCancelled'),
              )}
            >
              취소 {cancelledCount}
            </span>
          )}
        </div>

        {/* 모바일에서만 spacer */}
        <div className="flex-1 md:hidden" />

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
        <span
          className={twMerge(feedbackModalDesign.headerChip, 'text-gray-500')}
        >
          총 {totalCount}명
        </span>
        <span
          className={twMerge(
            feedbackModalDesign.headerChip,
            statusBadgeOrMuted(waitingCount, waitingKey),
          )}
        >
          {waitingLabel} {waitingCount}
        </span>
        <span
          className={twMerge(
            feedbackModalDesign.headerChip,
            statusBadgeOrMuted(inProgressCount, 'inProgress'),
          )}
        >
          진행 중 {inProgressCount}
        </span>
        <span
          className={twMerge(
            feedbackModalDesign.headerChip,
            statusBadgeOrMuted(completedCount, completedKey),
          )}
        >
          {completedLabel} {completedCount}
        </span>
        {missedCount !== undefined && (
          <span
            className={twMerge(
              feedbackModalDesign.headerChip,
              statusBadgeOrMuted(missedCount, missedKey),
            )}
          >
            {missedLabel} {missedCount}
          </span>
        )}
        {cancelledCount !== undefined && (
          <span
            className={twMerge(
              feedbackModalDesign.headerChip,
              statusBadgeOrMuted(cancelledCount, 'liveCancelled'),
            )}
          >
            취소 {cancelledCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default FeedbackHeader;
