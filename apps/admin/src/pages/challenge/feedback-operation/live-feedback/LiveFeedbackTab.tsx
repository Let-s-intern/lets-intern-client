import { useState } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from '@/lib/twMerge';

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
        // 예약 관리 컨테이너는 2.2 에서 연결한다.
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          예약 관리는 준비 중입니다.
        </div>
      ) : (
        // 멘토 스케줄 뷰는 Push 3 에서 구현한다.
        <div className="text-xsmall14 text-neutral-40 py-16 text-center">
          멘토 스케줄은 준비 중입니다.
        </div>
      )}
    </div>
  );
}
