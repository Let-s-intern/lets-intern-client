import { Suspense, lazy, useState } from 'react';
import { twMerge } from '@/lib/twMerge';
import MentorNoticeManagement from './MentorNoticeManagement';
import OngoingChallenges from './OngoingChallenges';

// LIVE 피드백 탭은 캘린더 등 무거운 의존성을 포함하므로 lazy import 한다.
const LiveFeedbackTab = lazy(() => import('./live-feedback/LiveFeedbackTab'));

type Tab = 'notice' | 'ongoing' | 'live';

const tabs: { id: Tab; label: string }[] = [
  { id: 'notice', label: '공지사항' },
  { id: 'ongoing', label: '진행중 챌린지' },
  { id: 'live', label: 'LIVE 피드백' },
];

export default function FeedbackOperationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('notice');

  return (
    <section className="p-5">
      <nav className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              'text-xsmall14 rounded-md border px-4 py-2',
              activeTab === tab.id
                ? 'border-neutral-0 bg-neutral-0 text-white'
                : 'border-neutral-80 text-neutral-40 bg-white',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'notice' && <MentorNoticeManagement />}
      {activeTab === 'ongoing' && <OngoingChallenges />}
      {activeTab === 'live' && (
        <Suspense
          fallback={
            <div className="text-xsmall14 text-neutral-40 py-16 text-center">
              불러오는 중...
            </div>
          }
        >
          <LiveFeedbackTab />
        </Suspense>
      )}
    </section>
  );
}
