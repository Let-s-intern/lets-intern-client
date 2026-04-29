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
  selectedIndex: number;
  onSelectByIndex: (index: number) => void;
}

function getFeedbackLabel(status: FeedbackStatus | null): string {
  if (status === 'COMPLETED' || status === 'CONFIRMED') return '완료';
  if (status === 'IN_PROGRESS') return '진행중';
  return '시작 전';
}

const MobileMenteeSelector = ({
  attendanceList,
  selectedIndex,
  onSelectByIndex,
}: MobileMenteeSelectorProps) => {
  const selectedMentee = attendanceList[selectedIndex];

  return (
    <div className="flex flex-col gap-1">
      <select
        value={selectedIndex}
        onChange={(e) => {
          const idx = Number(e.target.value);
          if (!Number.isNaN(idx) && idx >= 0) {
            onSelectByIndex(idx);
          }
        }}
        className="focus:border-primary focus:ring-primary w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-sm font-semibold text-neutral-900 focus:bg-white focus:outline-none focus:ring-1"
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
          const isAbsent = mentee.status === 'ABSENT' || mentee.id == null;
          const label = isAbsent
            ? '미제출'
            : getFeedbackLabel(mentee.feedbackStatus);

          return (
            <option key={mentee.id ?? `idx-${i}`} value={i}>
              {mentee.name} · {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default MobileMenteeSelector;
