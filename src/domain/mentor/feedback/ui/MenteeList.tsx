'use client';

import { twMerge } from '@/lib/twMerge';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import type { LiveFeedbackInfo } from '@/domain/mentor/schedule/types';

type LiveStatus = NonNullable<LiveFeedbackInfo['status']>;

interface MenteeItem {
  id: number | null;
  name: string;
  feedbackStatus: FeedbackStatus | null;
  status: string | null;
  /** 라이브 피드백 세션 날짜 — 있으면 날짜별 구분선 렌더 */
  date?: string;
  /** "HH:mm" 시작 시각 */
  startTime?: string;
  /** "HH:mm" 종료 시각 */
  endTime?: string;
  /** 라이브 피드백용: 제출물 제출 여부 — 있으면 두 줄 태그 레이아웃 */
  submissionLabel?: '제출' | '미제출';
  /** 라이브 피드백용: 실제 피드백 진행 상태 */
  liveStatus?: LiveStatus;
}

interface MenteeListProps {
  attendanceList: MenteeItem[];
  selectedIndex: number;
  onSelectByIndex: (index: number) => void;
  isLoading?: boolean;
}

function getFeedbackBadge(feedbackStatus: FeedbackStatus | null): {
  label: string;
  className: string;
} {
  switch (feedbackStatus) {
    case 'COMPLETED':
    case 'CONFIRMED':
      return {
        label: '완료',
        className: 'border border-green-200 bg-green-50 text-green-700',
      };
    case 'IN_PROGRESS':
      return {
        label: '진행 중',
        className: 'border border-blue-200 bg-blue-50 text-blue-600',
      };
    case 'WAITING':
    default:
      return {
        label: '시작 전',
        className: 'border border-red-200 bg-red-50 text-red-500',
      };
  }
}

/** 라이브 피드백 상태 → 배지 스타일. undefined/waiting은 '시작 전'. */
function getLiveStatusBadge(status: LiveStatus | undefined): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'completed':
      return {
        label: '피드백 완료',
        className: 'border border-green-200 bg-green-50 text-green-700',
      };
    case 'in-progress':
      return {
        label: '진행중',
        className: 'border border-blue-200 bg-blue-50 text-blue-600',
      };
    case 'mentor-late':
      return {
        label: '멘토 지각',
        className: 'border border-amber-200 bg-amber-50 text-amber-700',
      };
    case 'mentee-late':
      return {
        label: '멘티 지각',
        className: 'border border-amber-200 bg-amber-50 text-amber-700',
      };
    case 'mentor-absent':
      return {
        label: '멘토 미참여',
        className: 'border border-neutral-300 bg-neutral-100 text-neutral-600',
      };
    case 'mentee-absent':
      return {
        label: '멘티 미참여',
        className: 'border border-neutral-300 bg-neutral-100 text-neutral-600',
      };
    case 'waiting':
    default:
      return {
        label: '시작 전',
        className: 'border border-red-200 bg-red-50 text-red-500',
      };
  }
}

function getSubmissionBadge(label: '제출' | '미제출'): string {
  return label === '제출'
    ? 'border border-sky-200 bg-sky-50 text-sky-700'
    : 'border border-orange-200 bg-orange-50 text-orange-600';
}

function formatDateSeparator(iso: string): string {
  const d = new Date(iso);
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${weekday})`;
}

const MenteeList = ({
  attendanceList,
  selectedIndex,
  onSelectByIndex,
  isLoading = false,
}: MenteeListProps) => {
  return (
    <div className="flex h-full flex-col py-1 pl-1">
      <div className="flex flex-1 gap-2 overflow-hidden">
        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
              로딩중...
            </div>
          ) : attendanceList.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-sm text-neutral-400">
              멘티가 없습니다
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {attendanceList.map((mentee, idx) => {
                const isSelected = idx === selectedIndex;
                const isAbsent =
                  mentee.status === 'ABSENT' || mentee.id == null;
                const prev = attendanceList[idx - 1];
                const showDateHeader =
                  !!mentee.date &&
                  (!prev?.date || prev.date !== mentee.date);
                const hasTime = !!(mentee.startTime && mentee.endTime);

                // 라이브 피드백 모드: submissionLabel 또는 liveStatus 제공되면 두 줄 태그
                const isLiveMode =
                  mentee.submissionLabel !== undefined ||
                  mentee.liveStatus !== undefined;

                return (
                  <div key={mentee.id ?? `no-attendance-${idx}`}>
                    {showDateHeader && (
                      <div className="bg-neutral-100 px-4 py-1 text-[11px] font-semibold text-neutral-600">
                        {formatDateSeparator(mentee.date!)}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectByIndex(idx)}
                      className={twMerge(
                        'flex w-full items-center justify-between gap-2 border-b border-neutral-200 px-4 py-2 text-left transition-colors',
                        isSelected
                          ? 'rounded-md border-b-0 bg-primary-5'
                          : 'hover:bg-neutral-50',
                      )}
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="line-clamp-1 text-sm text-neutral-900">
                          {mentee.name}
                        </span>
                        {hasTime && (
                          <span className="text-[11px] text-neutral-500">
                            {mentee.startTime} ~ {mentee.endTime}
                          </span>
                        )}
                      </div>

                      {isLiveMode ? (
                        <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
                          {mentee.submissionLabel && (
                            <span
                              className={twMerge(
                                'rounded-full px-2 py-0.5 text-[10px] font-medium',
                                getSubmissionBadge(mentee.submissionLabel),
                              )}
                            >
                              {mentee.submissionLabel}
                            </span>
                          )}
                          {(() => {
                            const badge = getLiveStatusBadge(mentee.liveStatus);
                            return (
                              <span
                                className={twMerge(
                                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                                  badge.className,
                                )}
                              >
                                {badge.label}
                              </span>
                            );
                          })()}
                        </div>
                      ) : isAbsent ? (
                        <span className="ml-2 shrink-0 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-medium text-orange-600">
                          미제출
                        </span>
                      ) : (
                        (() => {
                          const badge = getFeedbackBadge(mentee.feedbackStatus);
                          return (
                            <span
                              className={twMerge(
                                'ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                                badge.className,
                              )}
                            >
                              {badge.label}
                            </span>
                          );
                        })()
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Custom scrollbar track */}
        <div className="w-2 shrink-0 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
};

export default MenteeList;
