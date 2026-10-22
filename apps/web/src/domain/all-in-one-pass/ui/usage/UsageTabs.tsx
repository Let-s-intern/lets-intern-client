// 나의 패스 이용 카테고리 탭 바 + 활성 탭 내용.
'use client';

import { CategoryChips, CategoryTabs } from '@letscareer/ui';
import { useState } from 'react';
import UsageChallengeTab from './UsageChallengeTab';
import UsageGuidebookTab from './UsageGuidebookTab';
import UsageLiveTab from './UsageLiveTab';
import UsageMentoringTab from './UsageMentoringTab';
import UsageVodTab from './UsageVodTab';

type UsageTabKey = 'CHALLENGE' | 'GUIDEBOOK' | 'VOD' | 'MENTORING' | 'LIVE';

const TABS: { value: UsageTabKey; label: string }[] = [
  { value: 'CHALLENGE', label: '챌린지' },
  { value: 'GUIDEBOOK', label: '가이드북' },
  { value: 'VOD', label: 'VOD' },
  { value: 'MENTORING', label: '멘토링' },
  { value: 'LIVE', label: 'LIVE 클래스' },
];

interface Props {
  privileges: { programType: string }[];
  passTitle?: string;
}

const UsageTabs = ({ privileges, passTitle }: Props) => {
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
      <CategoryChips
        options={visibleTabs}
        selected={active}
        onChange={setActive}
        className="border-neutral-80 sticky top-[84px] z-10 -mx-5 border-b bg-white px-5 py-4 md:hidden md:border-none md:py-0"
        activeClassName="bg-primary  text-static-100"
        inactiveClassName="bg-neutral-95 text-neutral-0 "
      />
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
        {active === 'GUIDEBOOK' && <UsageGuidebookTab passTitle={passTitle} />}
        {active === 'VOD' && <UsageVodTab />}
        {active === 'MENTORING' && <UsageMentoringTab />}
        {active === 'LIVE' && <UsageLiveTab passTitle={passTitle} />}
      </div>
    </div>
  );
};

export default UsageTabs;
