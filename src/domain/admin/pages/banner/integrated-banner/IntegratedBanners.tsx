import OutlinedButton from '@/common/button/OutlinedButton';
import { twMerge } from '@/lib/twMerge';
import { useState } from 'react';
import AllBanners from './all-banner/AllBanners';
import VisibleBanners from './visible-banner/VisibleBanners';

const TAB_TYPE = {
  VISIBLE: '노출 중',
  ALL: '전체',
} as const;

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

const IntegratedBanners = () => {
  const [tab, setTab] = useState<TabType>(TAB_TYPE.VISIBLE);

  return (
    <section className="flex flex-col gap-4 p-14">
      <h1 className="text-2xl font-semibold">통합 배너 관리</h1>
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setTab(TAB_TYPE.VISIBLE)}
            className={twMerge(
              tab === TAB_TYPE.VISIBLE ? 'text-primary' : 'text-neutral-20',
              'cursor-pointer',
            )}
          >
            {TAB_TYPE.VISIBLE}
          </button>
          <span className="px-2">|</span>
          <button
            onClick={() => setTab(TAB_TYPE.ALL)}
            className={twMerge(
              tab === TAB_TYPE.ALL ? 'text-primary' : 'text-neutral-20',
              'cursor-pointer',
            )}
          >
            {TAB_TYPE.ALL}
          </button>
        </div>

        <OutlinedButton onClick={() => {}} size="xs">
          등록
        </OutlinedButton>
      </div>

      {tab === TAB_TYPE.VISIBLE ? <VisibleBanners /> : <AllBanners />}
    </section>
  );
};

export default IntegratedBanners;
