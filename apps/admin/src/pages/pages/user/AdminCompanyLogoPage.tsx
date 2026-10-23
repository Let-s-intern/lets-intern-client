import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import CompanyLogoBulkRegister from '@/domain/company-logo/bulk/CompanyLogoBulkRegister';
import CompanyLogoManager from '@/domain/company-logo/CompanyLogoManager';
import Heading from '@/domain/admin/ui/heading/Heading';
import { twMerge } from '@/lib/twMerge';

type Tab = 'list' | 'bulk';

const tabs: { id: Tab; label: string }[] = [
  { id: 'list', label: '로고 목록' },
  { id: 'bulk', label: '일괄 등록' },
];

const LEAVE_BULK_MESSAGE = '저장하지 않은 변경 사항이 있습니다. 이동할까요?';

function isTab(value: string | null): value is Tab {
  return tabs.some((tab) => tab.id === value);
}

export default function AdminCompanyLogoPage() {
  // 탭은 URL(?tab=)에 둔다. 새로고침해도 보던 탭이 유지된다
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: Tab = isTab(tabParam) ? tabParam : 'list';

  // 일괄 등록 표에 저장하지 않은 행이 있으면 탭을 옮길 때 묻는다(옮기면 표가 사라진다)
  const [isBulkDirty, setIsBulkDirty] = useState(false);

  const setActiveTab = (tab: Tab) => {
    if (tab === activeTab) return;
    if (
      activeTab === 'bulk' &&
      isBulkDirty &&
      !window.confirm(LEAVE_BULK_MESSAGE)
    ) {
      return;
    }
    setIsBulkDirty(false);
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">멘토 관리</Heading>

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

      {activeTab === 'list' ? (
        <CompanyLogoManager />
      ) : (
        <CompanyLogoBulkRegister
          onDirtyChange={setIsBulkDirty}
          onGoToList={() => setActiveTab('list')}
        />
      )}
    </section>
  );
}
