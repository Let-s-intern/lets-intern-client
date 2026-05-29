import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="flex items-center justify-between">
        <h2 className="text-medium20 text-neutral-0 font-semibold">
          전체 예약 목록
        </h2>
        {/* 관리자 홈 라우트 미확정(PRD §7-5) → 임시로 루트(/)로 둔다. */}
        <Link to="/" className="text-xsmall14 text-neutral-40 hover:underline">
          ← 관리자 홈
        </Link>
      </div>

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
