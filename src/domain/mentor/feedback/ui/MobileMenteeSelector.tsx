'use client';

import type { FeedbackStatus } from '@/api/challenge/challengeSchema';

interface AttendanceItem {
  id: number;
  name: string;
  feedbackStatus: FeedbackStatus | null;
  status?: string | null;
}

interface MobileMenteeSelectorProps {
  attendanceList: AttendanceItem[];
  selectedAttendanceId: number | null;
  onSelectMentee: (attendanceId: number) => void;
}

function getFeedbackLabel(status: FeedbackStatus | null): string {
  if (status === 'COMPLETED' || status === 'CONFIRMED') return '완료';
  if (status === 'IN_PROGRESS') return '진행 중';
  return '시작 전';
}

const MobileMenteeSelector = ({
  attendanceList,
  selectedAttendanceId,
  onSelectMentee,
}: MobileMenteeSelectorProps) => {
  const selectedMentee = attendanceList.find(
    (a) => a.id === selectedAttendanceId,
  );

  return (
    <select
      value={selectedAttendanceId ?? ''}
      onChange={(e) => {
        const id = Number(e.target.value);
        if (!Number.isNaN(id) && id > 0) {
          onSelectMentee(id);
        }
      }}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      aria-label="멘티 선택"
    >
      {attendanceList.length === 0 ? (
        <option value="" disabled>
          멘티가 없습니다
        </option>
      ) : null}
      {attendanceList.map((mentee) => {
        const label = getFeedbackLabel(mentee.feedbackStatus);
        const absentMark = mentee.status === 'ABSENT' ? ' (미제출)' : '';

        return (
          <option key={mentee.id} value={mentee.id}>
            {mentee.name}
            {absentMark} - {label}
          </option>
        );
      })}
    </select>
  );
};

export default MobileMenteeSelector;
