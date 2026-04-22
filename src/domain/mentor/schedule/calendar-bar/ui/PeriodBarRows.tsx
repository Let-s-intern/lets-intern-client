'use client';

import type { ReactNode } from 'react';

import { getColor } from '../../constants/colors';

export interface ProgressCount {
  label: string;
  current: number;
  target: number;
}

interface PeriodBarRowsProps {
  colorIndex?: number;
  /** Row 1 왼쪽 — 타입 배지 ReactNode (색은 내부에서 자동 입힘) */
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
 * Period bar 구조.
 *
 * - 멘토 액션 (mentorProgress !== null) → Full: Row 1 (멘토 진행) + Row 2 (멘티 현황 + 챌린지 배지)
 * - 비액션 (mentorProgress === null)   → Compact: 한 줄, 챌린지 색. 태그 없음.
 */
const PeriodBarRows = ({
  colorIndex,
  typeBadge,
  mentorProgress,
  menteeStatus,
  challengeTitle,
  onClick,
  phaseCompleted,
}: PeriodBarRowsProps) => {
  const color = getColor(colorIndex ?? 0);
  // 완료 판정: phaseCompleted 명시 > 카운트 기반 자동 판정
  const mentorDone = phaseCompleted ?? isCompleted(mentorProgress);
  const isMentorAction = mentorProgress !== null;

  const wrapperClass =
    'relative z-10 flex w-full flex-col overflow-hidden text-left';
  const interactive = onClick
    ? ' transition-opacity hover:opacity-80'
    : '';

  // ── Compact: 비액션 바 (단일 행, 챌린지 색) ──────────────────────────
  if (!isMentorAction) {
    const menteeCountDone = menteeStatus
      ? menteeStatus.current >= menteeStatus.target && menteeStatus.target > 0
      : false;
    const compactDone = phaseCompleted ?? menteeCountDone;

    const compact = (
      <div
        className={`flex h-7 min-w-0 items-center gap-2 overflow-hidden ${color.text}`}
      >
        {compactDone && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            className={`shrink-0 ${color.text}`}
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

        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xxsmall12 font-medium tracking-[-0.3px]">
          {menteeStatus === null ? (
            <span>{compactDone ? '검수 완료' : '대기 중'}</span>
          ) : (
            <>
              <span>{menteeStatus.label}</span>
              <span className="font-semibold">{formatCount(menteeStatus)}</span>
            </>
          )}
        </div>

        <div
          className={`flex h-3 min-w-0 flex-1 items-center border-r-2 ${color.border}`}
        >
          <div className={`h-0.5 w-full ${color.line}`} />
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
  const typeBadgeColor = mentorDone ? color.text : 'text-red-500';
  const progressColor = mentorDone ? color.text : 'text-neutral-10';
  const progressLabelColor = mentorDone ? color.text : 'text-neutral-30';

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
            className={`shrink-0 ${color.text}`}
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

        <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xsmall14 font-medium tracking-[-0.3px]">
          <span className={progressLabelColor}>{mentorProgress.label}</span>
          <span className={`font-semibold ${progressColor}`}>
            {formatCount(mentorProgress)}
          </span>
        </div>

        <div
          className={`flex h-3 min-w-0 flex-1 items-center border-r-2 ${color.border}`}
        >
          <div className={`h-0.5 w-full ${color.line}`} />
        </div>
      </div>

      {/* Row 2: 멘티 현황 */}
      <div
        className={`flex items-center justify-between gap-2 p-2 ${color.body}`}
      >
        <span
          className={`min-w-0 truncate rounded-[3px] px-2 py-1 text-xxsmall12 font-medium tracking-[-0.3px] text-white ${color.badge}`}
        >
          {challengeTitle}
        </span>

        {menteeStatus !== null && (
          <div className="flex shrink-0 items-center gap-1 whitespace-nowrap px-1 text-xxsmall12 font-medium tracking-[-0.3px]">
            <span className="text-neutral-40">{menteeStatus.label}</span>
            <span className="text-neutral-10">
              {formatCount(menteeStatus)}
            </span>
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
