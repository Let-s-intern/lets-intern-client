// 나의 패스 이용 카테고리 탭 바 + 활성 탭 내용.
'use client';

import { CategoryTabs } from '@letscareer/ui';
import clsx from 'clsx';
import { useState } from 'react';
import type { PassPrivilege } from '../../types';
import UsageChallengeTab from './UsageChallengeTab';
import UsageGuidebookTab from './UsageGuidebookTab';
import UsageLiveTab from './UsageLiveTab';

type UsageTabKey = 'CHALLENGE' | 'GUIDEBOOK' | 'VOD' | 'MENTORING' | 'LIVE';

const TABS: { value: UsageTabKey; label: string }[] = [
  { value: 'CHALLENGE', label: '챌린지' },
  { value: 'GUIDEBOOK', label: '가이드북' },
  { value: 'VOD', label: 'VOD' },
  { value: 'MENTORING', label: '멘토링' },
  { value: 'LIVE', label: '라이브 클래스' },
];

const Placeholder = ({ label }: { label: string }) => (
  <p className="text-xsmall14 text-neutral-40 py-20 text-center">
    {label} 탭 준비 중
  </p>
);

interface Props {
  privileges: PassPrivilege[];
}

const UsageTabs = ({ privileges }: Props) => {
  const ownedTypes = new Set<string>(privileges.map((p) => p.programType));
  // 멘토링은 쿠폰 기반이라 권한과 무관하게 노출, 나머지는 플랜 권한 보유 시만
  const visibleTabs = TABS.filter(
    (t) => t.value === 'MENTORING' || ownedTypes.has(t.value),
  );

  const [active, setActive] = useState<UsageTabKey>(
    visibleTabs[0]?.value ?? 'CHALLENGE',
  );

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="border-neutral-80 scrollbar-hide sticky top-[84px] z-10 -mx-5 flex gap-2 overflow-x-auto border-b bg-white px-5 py-4 md:hidden md:border-none md:py-0">
        {visibleTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActive(tab.value)}
            className={clsx(
              'text-xsmall14 flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 transition-colors',
              tab.value === active
                ? 'bg-primary font-semibold text-white'
                : 'bg-neutral-95 text-neutral-0 font-medium',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="hidden md:block">
        <CategoryTabs
          options={visibleTabs}
          selected={active}
          onChange={setActive}
          size="small"
          full
          align="left"
          className="md:gap-6"
        />
      </div>
      <div>
        {active === 'CHALLENGE' && <UsageChallengeTab />}
        {active === 'GUIDEBOOK' && <UsageGuidebookTab />}
        {active === 'VOD' && <Placeholder label="VOD" />}
        {active === 'MENTORING' && <Placeholder label="멘토링" />}
        {active === 'LIVE' && <UsageLiveTab />}
      </div>
    </div>
  );
};

export default UsageTabs;
