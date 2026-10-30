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
  membershipId: number;
  privileges: { programType: string }[];
  passTitle?: string;
  /** VOD 옵션 추가결제 판매 여부. VOD 탭은 플랜 권한이 아니라 이 값으로 노출한다 */
  vodOptionOnSale: boolean;
}

const UsageTabs = ({
  membershipId,
  privileges,
  passTitle,
  vodOptionOnSale,
}: Props) => {
  const ownedTypes = new Set<string>(privileges.map((p) => p.programType));
  // 멘토링은 쿠폰 기반이라 권한과 무관하게 노출, VOD 는 판매가 켜진 패스만, 나머지는 플랜 권한 보유 시만
  const visibleTabs = TABS.filter((t) => {
    if (t.value === 'MENTORING') return true;
    if (t.value === 'VOD') return vodOptionOnSale;
    return ownedTypes.has(t.value);
  });

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
        {active === 'VOD' && <UsageVodTab membershipId={membershipId} />}
        {active === 'MENTORING' && <UsageMentoringTab />}
        {active === 'LIVE' && <UsageLiveTab passTitle={passTitle} />}
      </div>
    </div>
  );
};

export default UsageTabs;
