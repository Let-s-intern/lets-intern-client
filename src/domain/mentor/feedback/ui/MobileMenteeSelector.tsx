'use client';

import type { FeedbackStatus } from '@/api/challenge/challengeSchema';

interface AttendanceItem {
  id: number | null;
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
  if (status === 'IN_PROGRESS') return '진행중';
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
  const selectedIndex = attendanceList.findIndex(
    (a) => a.id === selectedAttendanceId,
  );

  return (
    <div className="flex flex-col gap-1">
      <select
        value={selectedAttendanceId ?? ''}
        onChange={(e) => {
          const id = Number(e.target.value);
          if (!Number.isNaN(id) && id > 0) {
            onSelectMentee(id);
          }
        }}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm font-semibold text-neutral-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
        aria-label="멘티 선택"
      >
        {attendanceList.length === 0 ? (
          <option value="" disabled>
            멘티가 없습니다
          </option>
        ) : null}
        {attendanceList.map((mentee, i) => {
          if (mentee.id == null) return null;
          const label = getFeedbackLabel(mentee.feedbackStatus);
          const absentMark = mentee.status === 'ABSENT' ? ' (미제출)' : '';

          return (
            <option key={mentee.id} value={mentee.id}>
              {mentee.name}{absentMark} · {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default MobileMenteeSelector;
