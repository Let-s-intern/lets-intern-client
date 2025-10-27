'use client';

import DataTableExample from '@components/common/DataTableExample';
import { Plus } from 'lucide-react';

const Experience = () => {
  const handleDrawerOpen = () => {
    // 드로어 열기 로직 구현
  };

  return (
    <section className="flex w-full flex-col gap-3 px-5 pb-20">
      <div className="flex w-full justify-between">
        <h1 className="text-lg font-semibold">경험 작성</h1>
        <SolidButton onClick={handleDrawerOpen}>경험 작성</SolidButton>
      </div>

      <div>{/* 필터 드롭다운 */}</div>

      <DataTableExample />
    </section>
  );
};

export default Experience;

// TODO: props로 variant 등 추가 예정)
interface SolidButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const SolidButton = ({ children, onClick }: SolidButtonProps) => {
  return (
    <button
      className="hover:bg-primary-15 flex cursor-pointer items-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-primary"
      onClick={onClick}
    >
      <Plus size={16} />
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};
