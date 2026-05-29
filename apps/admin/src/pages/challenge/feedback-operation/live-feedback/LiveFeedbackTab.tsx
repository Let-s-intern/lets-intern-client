import { lazy, Suspense, useState } from 'react';
import { twMerge } from '@/lib/twMerge';
import ReservationManagement from './reservation/ReservationManagement';

// 멘토 스케줄은 멘토별 병렬 슬롯 조회 + 그리드라 무게가 있어 지연 로드한다.
const MentorScheduleView = lazy(
  () => import('./mentor-schedule/MentorScheduleView'),
);

type SubTab = 'reservation' | 'schedule';

const subTabs: { id: SubTab; label: string }[] = [
  { id: 'reservation', label: '예약 관리' },
  { id: 'schedule', label: '멘토 스케줄' },
];

export default function LiveFeedbackTab() {
  const [subTab, setSubTab] = useState<SubTab>('reservation');

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-medium20 text-neutral-0 font-semibold">
        전체 예약 목록
      </h2>

      <nav className="border-neutral-80 flex gap-1 border-b">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={twMerge(
              'text-xsmall14 -mb-px border-b-2 px-4 py-2',
              subTab === tab.id
                ? 'border-neutral-0 text-neutral-0 font-semibold'
                : 'text-neutral-40 border-transparent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {subTab === 'reservation' ? (
        <ReservationManagement />
      ) : (
        <Suspense fallback={null}>
          <MentorScheduleView />
        </Suspense>
      )}
    </div>
  );
}
