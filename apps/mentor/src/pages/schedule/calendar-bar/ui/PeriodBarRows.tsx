import type { ReactNode } from 'react';

export interface ProgressCount {
  label: string;
  current: number;
  target: number;
}

interface PeriodBarRowsProps {
  /** Row 1 왼쪽 — 타입 배지 ReactNode */
  typeBadge: ReactNode;
  /** Row 1 카운트 — 멘토 진행. null이면 비액션(compact) 모드로 전환 */
  mentorProgress: ProgressCount | null;
  /** Row 2 카운트 — 멘티 현황. null이면 "대기 중" */
  menteeStatus: ProgressCount | null;
  /** Row 2 왼쪽 — 챌린지명 배지 (compact 모드에서는 렌더 안 함) */
  challengeTitle: string;
  /** 클릭 가능 여부 */
  onClick?: () => void;
  /** 비액션(compact) 바에서 해당 단계가 끝났는지 — 끝났으면 ✓ 표시 */
  phaseCompleted?: boolean;
}

function formatCount({ current, target }: ProgressCount): string {
  return `${current} / ${target}`;
}

function isCompleted(p: ProgressCount | null): boolean {
  return !!p && p.target > 0 && p.current >= p.target;
}

/**
 * Period bar 구조 (PRD-0503 #4 색 구분 제거 후).
 *
 * 챌린지별 색상 매핑을 폐기하고 모든 바를 중성 톤으로 통일한다.
 *  - Compact 비액션 바: 옅은 회색 본문 + 회색 텍스트
 *  - Full 액션 바    : 흰 카드 + 회색 보더, 미완료 시 빨간 강조
 */
const PeriodBarRows = ({
  typeBadge,
  mentorProgress,
  menteeStatus,
  challengeTitle,
  onClick,
  phaseCompleted,
}: PeriodBarRowsProps) => {
  const mentorDone = phaseCompleted ?? isCompleted(mentorProgress);
  const isMentorAction = mentorProgress !== null;

  const wrapperClass =
    'relative z-10 flex w-full flex-col overflow-hidden text-left';
  const interactive = onClick ? ' transition-opacity hover:opacity-80' : '';

  // ── Compact: 비액션 바 (단일 행, 중성 톤) ─────────────────────────────
  if (!isMentorAction) {
    const menteeCountDone = menteeStatus
      ? menteeStatus.current >= menteeStatus.target && menteeStatus.target > 0
      : false;
    const compactDone = phaseCompleted ?? menteeCountDone;

    const compact = (
      <div className="flex h-7 min-w-0 items-center gap-2 overflow-hidden text-neutral-30">
        {compactDone && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        <div className="flex shrink-0 items-center gap-1">{typeBadge}</div>

        <div className="text-xxsmall12 flex shrink-0 items-center gap-1 whitespace-nowrap font-medium tracking-[-0.3px]">
          {menteeStatus === null ? (
            <span>{compactDone ? '검수 완료' : '대기 중'}</span>
          ) : (
            <>
              <span>{menteeStatus.label}</span>
              <span className="font-semibold">{formatCount(menteeStatus)}</span>
            </>
          )}
        </div>

        <div className="flex h-3 min-w-0 flex-1 items-center border-r-2 border-neutral-80">
          <div className="h-0.5 w-full bg-neutral-80" />
        </div>
      </div>
    );

    if (onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className={`${wrapperClass}${interactive}`}
        >
          {compact}
        </button>
      );
    }
    return <div className={wrapperClass}>{compact}</div>;
  }

  // ── Full: 멘토 액션 바 (Row 1 + Row 2) ───────────────────────────────
  const typeBadgeColor = mentorDone ? 'text-neutral-30' : 'text-red-500';
  const progressColor = mentorDone ? 'text-neutral-30' : 'text-neutral-10';
  const progressLabelColor = mentorDone ? 'text-neutral-30' : 'text-neutral-30';

  const full = (
    <>
      {/* Row 1: 멘토 진행 */}
      <div className="flex h-7 min-w-0 items-center gap-2 overflow-hidden">
        {mentorDone && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            className="shrink-0 text-neutral-30"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        <div className={`flex shrink-0 items-center gap-1 ${typeBadgeColor}`}>
          {typeBadge}
        </div>

        <div className="text-xsmall14 flex shrink-0 items-center gap-1 whitespace-nowrap font-medium tracking-[-0.3px]">
          <span className={progressLabelColor}>{mentorProgress.label}</span>
          <span className={`font-semibold ${progressColor}`}>
            {formatCount(mentorProgress)}
          </span>
        </div>

        <div className="flex h-3 min-w-0 flex-1 items-center border-r-2 border-neutral-80">
          <div className="h-0.5 w-full bg-neutral-80" />
        </div>
      </div>

      {/* Row 2: 멘티 현황 */}
      <div className="flex items-center justify-between gap-2 bg-neutral-95 p-2">
        <span className="text-xxsmall12 min-w-0 truncate rounded-[3px] bg-neutral-30 px-2 py-1 font-medium tracking-[-0.3px] text-white">
          {challengeTitle}
        </span>

        {menteeStatus !== null && (
          <div className="text-xxsmall12 flex shrink-0 items-center gap-1 whitespace-nowrap px-1 font-medium tracking-[-0.3px]">
            <span className="text-neutral-40">{menteeStatus.label}</span>
            <span className="text-neutral-10">{formatCount(menteeStatus)}</span>
          </div>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${wrapperClass}${interactive}`}
      >
        {full}
      </button>
    );
  }
  return <div className={wrapperClass}>{full}</div>;
};

export default PeriodBarRows;
