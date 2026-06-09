import { twMerge } from '@/lib/twMerge';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import { STATUS_BADGE } from '@/constants/statusColors';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import { currentNow } from '@/pages/schedule/constants/mockNow';
import type { LiveFeedbackInfo } from '@/pages/schedule/types';

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

/**
 * 멘티 리스트 상태 뱃지 색 (디자인 시안 image #15 기준).
 * - 진행 중 / 진행 전: 보라(primary), 임박한 진행 전은 빨강으로 강조
 * - 진행 완료: 회색 아웃라인
 * (헤더 칩 등 다른 화면의 STATUS_BADGE 와 분리 — 모달 멘티 리스트 전용)
 */
const LIST_BADGE_COLOR = {
  active: 'bg-primary-5 text-primary',
  urgent: 'bg-red-50 text-red-500',
  done: 'border border-neutral-300 bg-white text-neutral-500',
} as const;

function getFeedbackBadge(feedbackStatus: FeedbackStatus | null): {
  label: string;
  className: string;
} {
  switch (feedbackStatus) {
    case 'COMPLETED':
    case 'CONFIRMED':
      return { label: '진행 완료', className: LIST_BADGE_COLOR.done };
    case 'IN_PROGRESS':
      return { label: '진행 중', className: LIST_BADGE_COLOR.active };
    case 'WAITING':
    default:
      return { label: '진행 전', className: LIST_BADGE_COLOR.active };
  }
}

/**
 * 라이브 피드백 상태 → 배지 스타일.
 * waiting(진행 전)은 기본 보라, 임박(imminent) 시 빨강으로 강조 (시안 image #15).
 */
function getLiveStatusBadge(
  status: LiveStatus | undefined,
  imminent = false,
): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'completed':
      return { label: '진행 완료', className: LIST_BADGE_COLOR.done };
    case 'in-progress':
      return { label: '진행 중', className: LIST_BADGE_COLOR.active };
    case 'mentor-late':
    case 'mentee-late':
    case 'mentor-absent':
    case 'mentee-absent':
      // LC-3124: 지각·미참여 세분 상태는 진리표 4종 라벨로 통일 → '미진행'
      return { label: '미진행', className: STATUS_BADGE.absent };
    case 'waiting':
    default:
      return {
        label: '진행 예정',
        className: imminent ? LIST_BADGE_COLOR.urgent : LIST_BADGE_COLOR.active,
      };
  }
}

function getSubmissionBadge(label: '제출' | '미제출'): string {
  return label === '제출' ? STATUS_BADGE.submitted : STATUS_BADGE.notSubmitted;
}

const ONE_HOUR_MS = 60 * 60 * 1000;

/** 세션 시작이 현재 시각으로부터 1시간 이내(미래)면 true */
function isSessionImminent(
  date: string | undefined,
  startTime: string | undefined,
): boolean {
  if (!date || !startTime) return false;
  const target = new Date(`${date}T${startTime}:00`).getTime();
  if (Number.isNaN(target)) return false;
  const diff = target - currentNow().getTime();
  return diff > 0 && diff <= ONE_HOUR_MS;
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
                const hasTime = !!(mentee.startTime && mentee.endTime);
                const imminent = isSessionImminent(
                  mentee.date,
                  mentee.startTime,
                );

                // 라이브 피드백 모드: submissionLabel 또는 liveStatus 제공되면 두 줄 태그
                const isLiveMode =
                  mentee.submissionLabel !== undefined ||
                  mentee.liveStatus !== undefined;

                return (
                  <div key={mentee.id ?? `no-attendance-${idx}`}>
                    <button
                      type="button"
                      onClick={() => onSelectByIndex(idx)}
                      className={twMerge(
                        'flex w-full items-center justify-between gap-2 px-4 py-2 text-left transition-colors',
                        isSelected
                          ? 'bg-primary-5 rounded-md'
                          : 'hover:bg-neutral-50',
                      )}
                    >
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span
                          className={twMerge(
                            'line-clamp-1 text-sm',
                            imminent
                              ? 'text-primary font-semibold'
                              : 'text-neutral-900',
                          )}
                        >
                          {mentee.name}
                        </span>
                        {hasTime && (
                          <span
                            className={twMerge(
                              'text-[11px]',
                              imminent
                                ? 'text-primary font-medium'
                                : 'text-neutral-500',
                            )}
                          >
                            {mentee.startTime} ~ {mentee.endTime}
                          </span>
                        )}
                      </div>

                      {isLiveMode ? (
                        <div className="ml-2 flex shrink-0 flex-col items-end gap-1">
                          {mentee.submissionLabel && (
                            <span
                              className={twMerge(
                                feedbackModalDesign.listBadgeSm,
                                getSubmissionBadge(mentee.submissionLabel),
                              )}
                            >
                              {mentee.submissionLabel}
                            </span>
                          )}
                          {(() => {
                            const badge = getLiveStatusBadge(
                              mentee.liveStatus,
                              imminent,
                            );
                            return (
                              <span
                                className={twMerge(
                                  feedbackModalDesign.listBadgeSm,
                                  badge.className,
                                )}
                              >
                                {badge.label}
                              </span>
                            );
                          })()}
                        </div>
                      ) : isAbsent ? (
                        <span
                          className={twMerge(
                            feedbackModalDesign.listBadgeMd,
                            'ml-2 shrink-0 border border-orange-200 bg-orange-50 text-orange-600',
                          )}
                        >
                          미제출
                        </span>
                      ) : (
                        (() => {
                          const badge = getFeedbackBadge(mentee.feedbackStatus);
                          return (
                            <span
                              className={twMerge(
                                feedbackModalDesign.listBadgeMd,
                                'ml-2 shrink-0',
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
