'use client';

import ExperienceDataTable from '@components/common/mypage/experience/ExperienceDataTable';
import ExperienceFilters, {
  Filters,
} from '@components/common/mypage/experience/ExperienceFilters';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const Experience = () => {
  const [filters, setFilters] = useState<Filters>({
    category: 'ALL',
    activity: 'ALL',
    year: 'ALL',
    coreCompetency: 'ALL',
  });

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  const handleDrawerOpen = () => {
    // 드로어 열기 로직 구현
  };

  return (
    <div className="flex w-full flex-col gap-3 px-5 pb-20">
      <section className="flex w-full justify-between">
        <h1 className="text-lg font-semibold">경험 정리 목록</h1>
        <SolidButton onClick={handleDrawerOpen}>경험 작성</SolidButton>
      </section>

      <section className="flex justify-between">
        <ExperienceFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
        />

        {/* 정렬 필터 영역 (추후 구현) */}
      </section>

      <ExperienceDataTable filters={filters} />
    </div>
  );
};

export default Experience;

// TODO: props로 variant 등 추가 예정
interface SolidButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const SolidButton = ({ children, onClick }: SolidButtonProps) => {
  return (
    <button
      className="flex cursor-pointer items-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-primary hover:bg-primary-15"
      onClick={onClick}
    >
      <Plus size={16} />
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};
