import { useSearchParams } from 'react-router-dom';

import Heading from '@/domain/admin/ui/heading/Heading';
import AdminLiveMentoringParticipantTable from '@/domain/live-mentoring/AdminLiveMentoringParticipantTable';
import AdminLiveMentoringTable from '@/domain/live-mentoring/AdminLiveMentoringTable';
import { twMerge } from '@/lib/twMerge';

type Tab = 'products' | 'participants';

const tabs: { id: Tab; label: string }[] = [
  { id: 'products', label: '상품 관리' },
  { id: 'participants', label: '참여자' },
];

const TAB_DESCRIPTION: Record<Tab, string> = {
  products:
    '멘토가 만든 1대1 라이브 멘토링 상품과 현재 개설을 조회합니다. 개설은 멘토가 직접 열고 닫으며, 필요하면 여기서 강제 종료할 수 있습니다.',
  participants:
    '1대1 라이브 멘토링을 결제한 참여자를 조회합니다. 여기서 하는 조작은 환불뿐입니다.',
};

function isTab(value: string | null): value is Tab {
  return tabs.some((tab) => tab.id === value);
}

export default function AdminLiveMentoringPage() {
  // 탭 상태를 URL(?tab=)에 둔다. 새로고침해도 보던 탭이 유지된다.
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: Tab = isTab(tabParam) ? tabParam : 'products';

  const setActiveTab = (tab: Tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="p-5">
      <Heading className="mb-1">1대1 라이브 멘토링 관리</Heading>
      <p className="text-xsmall14 text-neutral-40 mb-4">
        {TAB_DESCRIPTION[activeTab]}
      </p>

      <nav className="border-neutral-80 mb-4 flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              'text-xsmall14 -mb-px border-b-2 px-4 py-2',
              activeTab === tab.id
                ? 'border-neutral-0 text-neutral-0 font-semibold'
                : 'text-neutral-40 border-transparent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'products' ? (
        <AdminLiveMentoringTable />
      ) : (
        <AdminLiveMentoringParticipantTable />
      )}
    </section>
  );
}
