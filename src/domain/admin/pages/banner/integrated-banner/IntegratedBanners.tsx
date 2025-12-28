import TableLayout from '@/domain/admin/ui/table/TableLayout';
import { twMerge } from '@/lib/twMerge';
import { useState } from 'react';
import VisibleBanners from './visible-banner/VisibleBanners';

const TAB_TYPE = {
  VISIBLE: '노출 중',
  ALL: '전체',
} as const;

type TabType = (typeof TAB_TYPE)[keyof typeof TAB_TYPE];

const IntegratedBanners = () => {
  const [tab, setTab] = useState<TabType>(TAB_TYPE.VISIBLE);

  return (
    <TableLayout
      title="통합 배너 관리"
      headerButton={{
        label: '등록',
        href: '/admin/banner/pop-up/new',
      }}
    >
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
      {tab === TAB_TYPE.VISIBLE ? <VisibleBanners /> : <></>}
    </TableLayout>
  );
};

export default IntegratedBanners;
