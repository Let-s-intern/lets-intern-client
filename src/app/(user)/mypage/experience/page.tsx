'use client';

import { FilterDropdown } from '@components/common/challenge/my-challenge/section/mission-submit-list-form/components/ExperienceSelectModal/components/FilterDropdown';
import DataTableExample from '@components/common/DataTableExample';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface Filters {
  category: string;
  type: string;
  year: string;
  competency: string;
}

const FILTER_OPTIONS = {
  experience: [
    { value: '전체', label: '전체' },
    { value: '프로젝트', label: '프로젝트' },
    { value: '동아리', label: '동아리' },
    { value: '학회', label: '학회' },
    { value: '교육', label: '교육' },
    { value: '공모전', label: '공모전' },
    { value: '기타', label: '기타' },
  ],
  type: [
    { value: '전체', label: '전체' },
    { value: '팀', label: '팀' },
    { value: '개인', label: '개인' },
  ],
  year: [
    { value: '전체', label: '전체' },
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
  ],
  competency: [
    { value: '전체', label: '전체' },
    { value: '데이터분석', label: '데이터 분석' },
    { value: '프론트엔드', label: '프론트엔드 개발' },
    { value: '백엔드', label: '백엔드 개발' },
    { value: 'UI/UX', label: 'UI/UX 설계' },
    { value: '마케팅', label: '마케팅' },
    { value: '기획', label: '기획' },
  ],
};

const Experience = () => {
  const [filters, setFilters] = useState({
    category: '전체',
    type: '전체',
    year: '전체',
    competency: '전체',
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
    <section className="flex w-full flex-col gap-3 px-5 pb-20">
      <div className="flex w-full justify-between">
        <h1 className="text-lg font-semibold">경험 정리 목록</h1>
        <SolidButton onClick={handleDrawerOpen}>경험 작성</SolidButton>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <FilterDropdown
            labelPrefix="경험 분류"
            options={FILTER_OPTIONS.experience}
            selectedValue={filters.category}
            onSelect={(value) => handleFilterChange('category', value)}
            width="min-w-[8.25rem]"
          />
          <FilterDropdown
            labelPrefix="팀·개인"
            options={FILTER_OPTIONS.type}
            selectedValue={filters.type}
            onSelect={(value) => handleFilterChange('type', value)}
            width="min-w-[7.5rem]"
          />
          <FilterDropdown
            labelPrefix="연도"
            options={FILTER_OPTIONS.year}
            selectedValue={filters.year}
            onSelect={(value) => handleFilterChange('year', value)}
            width="min-w-[6.5rem]"
          />
          <FilterDropdown
            labelPrefix="핵심 역량"
            options={FILTER_OPTIONS.competency}
            selectedValue={filters.competency}
            onSelect={(value) => handleFilterChange('competency', value)}
            width="min-w-[8.25rem]"
          />
        </div>
      </div>

      <DataTableExample />
    </section>
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
      className="hover:bg-primary-15 flex cursor-pointer items-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-primary"
      onClick={onClick}
    >
      <Plus size={16} />
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};
