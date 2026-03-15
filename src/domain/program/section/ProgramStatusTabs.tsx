'use client';

import CategoryTabs from '@/common/ui/CategoryTabs';

const STATUS_TAB_OPTIONS = [
  { value: '', label: '전체' },
  { value: 'PROCEEDING', label: '모집 중' },
  { value: 'PREV', label: '모집 예정' },
  { value: 'POST', label: '모집 종료' },
] as const;

interface ProgramStatusTabsProps {
  selected: string;
  onChange: (value: string) => void;
}

const ProgramStatusTabs = ({ selected, onChange }: ProgramStatusTabsProps) => {
  return <CategoryTabs options={[...STATUS_TAB_OPTIONS]} selected={selected} onChange={onChange} />;
};

export default ProgramStatusTabs;
