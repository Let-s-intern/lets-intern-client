'use client';

import { twMerge } from '@/lib/twMerge';
import {
  useMentorMissionFeedbackAttendanceQuery,
  MentorMissionFeedbackAttendanceQueryKey,
} from '@/api/challenge/challenge';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';

interface MenteeListProps {
  challengeId: number;
  missionId: number;
  challengeTitle?: string;
  missionTh?: number;
  selectedAttendanceId: number | null;
  onSelectMentee: (attendanceId: number) => void;
}

function getBadgeStyle(
  feedbackStatus: FeedbackStatus | null,
  status: string,
): { label: string; className: string } {
  // status === 'ABSENT' means not submitted
  if (status === 'ABSENT') {
    return { label: '제출전', className: 'bg-red-500 text-white' };
  }

  switch (feedbackStatus) {
    case 'COMPLETED':
    case 'CONFIRMED':
      return { label: '완료', className: 'bg-green-600 text-white' };
    case 'IN_PROGRESS':
      return { label: '진행 중', className: 'bg-yellow-400 text-black' };
    case 'WAITING':
    default:
      return { label: '시작전', className: 'bg-gray-300 text-gray-700' };
  }
}

// DEV mock – 목 챌린지(9999)용
const MOCK_ATTENDANCE_LIST = [
  { id: 88801, name: '김테스트', status: 'PRESENT' as const, feedbackStatus: 'WAITING' as const },
  { id: 88802, name: '이테스트', status: 'PRESENT' as const, feedbackStatus: 'IN_PROGRESS' as const },
  { id: 88803, name: '박미제출', status: 'ABSENT' as const, feedbackStatus: null },
];

const MenteeList = ({
  challengeId,
  missionId,
  challengeTitle,
  missionTh,
  selectedAttendanceId,
  onSelectMentee,
}: MenteeListProps) => {
  const isMock = challengeId === 9999;
  const { data, isLoading } = useMentorMissionFeedbackAttendanceQuery({
    challengeId,
    missionId,
    enabled: !!challengeId && !!missionId && !isMock,
  });

  const attendanceList = isMock
    ? MOCK_ATTENDANCE_LIST
    : (data?.attendanceList ?? []);

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r border-gray-200">
      {/* Group header */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <span className="text-sm font-semibold text-gray-800">
          {challengeTitle ?? '챌린지'} {missionTh ?? ''}차 피드백
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
          로딩중...
        </div>
      ) : attendanceList.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
          멘티가 없습니다
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {attendanceList.map((mentee) => {
            const badge = getBadgeStyle(mentee.feedbackStatus, mentee.status);
            const isSelected = mentee.id === selectedAttendanceId;

            return (
              <li key={mentee.id}>
                <button
                  type="button"
                  onClick={() => onSelectMentee(mentee.id)}
                  className={twMerge(
                    'flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50',
                    isSelected && 'bg-gray-100 font-medium',
                  )}
                >
                  <span className="truncate">{mentee.name}</span>
                  <span
                    className={twMerge(
                      'ml-2 shrink-0 rounded px-2 py-0.5 text-xs font-medium',
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MenteeList;
