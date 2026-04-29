'use client';

import { twMerge } from '@/lib/twMerge';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';

interface MenteeItem {
  id: number | null;
  name: string;
  feedbackStatus: FeedbackStatus | null;
  status: string | null;
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
                const feedbackBadge = getFeedbackBadge(mentee.feedbackStatus);
                const isAbsent =
                  mentee.status === 'ABSENT' || mentee.id == null;

                return (
                  <button
                    key={mentee.id ?? `no-attendance-${idx}`}
                    type="button"
                    onClick={() => onSelectByIndex(idx)}
                    className={twMerge(
                      'flex w-full items-center justify-between border-b border-neutral-200 px-4 py-2 text-left transition-colors',
                      isSelected
                        ? 'bg-primary-5 rounded-md border-b-0'
                        : 'hover:bg-neutral-50',
                    )}
                  >
                    <span className="line-clamp-1 text-sm text-neutral-900">
                      {mentee.name}
                    </span>
                    {isAbsent ? (
                      <span className="ml-2 shrink-0 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-medium text-orange-600">
                        미제출
                      </span>
                    ) : (
                      <span
                        className={twMerge(
                          'ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium',
                          feedbackBadge.className,
                        )}
                      >
                        {feedbackBadge.label}
                      </span>
                    )}
                  </button>
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
