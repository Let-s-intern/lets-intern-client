'use client';

import { FilterDropdown } from './FilterDropdown';

interface Filters {
  category: string;
  type: string;
  year: string;
  competency: string;
}

interface ExperienceSelectModalFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const FILTER_OPTIONS = {
  category: [
    { value: '전체', label: '전체' },
    { value: '프로젝트', label: '프로젝트' },
    { value: '학회', label: '학회' },
    { value: '동아리', label: '동아리' },
    { value: '교육', label: '교육' },
    { value: '공모전', label: '공모전' },
    { value: '대외활동', label: '대외활동' },
    { value: '인턴', label: '인턴' },
    { value: '회사', label: '회사' },
    { value: '대학교', label: '대학교' },
    { value: '기타', label: '기타' },
  ],
  type: [
    { value: '전체', label: '전체' },
    { value: '팀', label: '팀' },
    { value: '개인', label: '개인' },
  ],
  year: [
    { value: '전체', label: '전체' },
    { value: '2025', label: '2025년' },
    { value: '2024', label: '2024년' },
    { value: '2023', label: '2023년' },
    { value: '2022', label: '2022년' },
    { value: '2021', label: '2021년' },
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

export const ExperienceSelectModalFilters = ({
  filters,
  onFiltersChange,
}: ExperienceSelectModalFiltersProps) => {
  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  return (
    <div className="px-6 py-4">
      <div className="flex gap-3">
        {/* 경험 분류 필터 */}
        <FilterDropdown
          labelPrefix="경험 분류"
          options={FILTER_OPTIONS.category}
          selectedValue={filters.category}
          onSelect={(value: string) => handleFilterChange('category', value)}
          width="w-52"
        />

        {/* 팀·개인 필터 */}
        <FilterDropdown
          labelPrefix="팀·개인"
          options={FILTER_OPTIONS.type}
          selectedValue={filters.type}
          onSelect={(value: string) => handleFilterChange('type', value)}
          width="w-36"
        />

        {/* 연도 필터 */}
        <FilterDropdown
          labelPrefix="연도"
          options={FILTER_OPTIONS.year}
          selectedValue={filters.year}
          onSelect={(value: string) => handleFilterChange('year', value)}
          width="w-32"
        />

        {/* 핵심 역량 필터 */}
        <FilterDropdown
          labelPrefix="핵심 역량"
          options={FILTER_OPTIONS.competency}
          selectedValue={filters.competency}
          onSelect={(value: string) => handleFilterChange('competency', value)}
          width="w-44"
        />
      </div>
    </div>
  );
};
