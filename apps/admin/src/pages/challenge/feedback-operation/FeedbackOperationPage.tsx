import { Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';
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

function isTab(value: string | null): value is Tab {
  return value === 'notice' || value === 'ongoing' || value === 'live';
}

export default function FeedbackOperationPage() {
  // 탭 상태를 URL(?tab=)에 둔다. 새로고침해도 보던 탭이 유지되어
  // 공지 탭으로 리셋되며 불필요한 재조회가 나가는 문제를 막는다.
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: Tab = isTab(tabParam) ? tabParam : 'notice';

  const setActiveTab = (tab: Tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

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
