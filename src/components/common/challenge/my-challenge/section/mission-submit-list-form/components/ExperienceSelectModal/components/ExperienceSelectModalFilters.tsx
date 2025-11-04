'use client';

import { UserExperienceFilters } from '@/api/userExperienceSchema';
import { useMemo } from 'react';
import { activityTypeToLabel, experienceCategoryToLabel } from '../../../data';
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
  filterOptions?: UserExperienceFilters;
}

export const ExperienceSelectModalFilters = ({
  filters,
  onFiltersChange,
  filterOptions,
}: ExperienceSelectModalFiltersProps) => {
  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
  };

  // API 필터 옵션을 UI 옵션으로 변환
  const filterOptionsFormatted = useMemo(() => {
    const categoryOptions = [
      { value: '전체', label: '전체' },
      ...(filterOptions?.availableCategories.map((cat) => ({
        value: experienceCategoryToLabel[cat] || cat,
        label: experienceCategoryToLabel[cat] || cat,
      })) || []),
    ];

    const typeOptions = [
      { value: '전체', label: '전체' },
      ...(filterOptions?.availableActivityTypes.map((type) => ({
        value: activityTypeToLabel[type] || type,
        label: activityTypeToLabel[type] || type,
      })) || []),
    ];

    const yearOptions = [
      { value: '전체', label: '전체' },
      ...(filterOptions?.availableYears
        .sort((a, b) => b - a) // 내림차순 정렬
        .map((year) => ({
          value: String(year),
          label: `${year}년`,
        })) || []),
    ];

    const competencyOptions = [
      { value: '전체', label: '전체' },
      ...(filterOptions?.availableCoreCompetencies.map((comp) => ({
        value: comp,
        label: comp,
      })) || []),
    ];

    return {
      category: categoryOptions,
      type: typeOptions,
      year: yearOptions,
      competency: competencyOptions,
    };
  }, [filterOptions]);

  return (
    <div className="px-6 py-4">
      <div className="flex gap-3">
        {/* 경험 분류 필터 */}
        <FilterDropdown
          labelPrefix="경험 분류"
          options={filterOptionsFormatted.category}
          selectedValue={filters.category}
          onSelect={(value: string) => handleFilterChange('category', value)}
          width="w-52"
        />

        {/* 팀·개인 필터 */}
        <FilterDropdown
          labelPrefix="팀·개인"
          options={filterOptionsFormatted.type}
          selectedValue={filters.type}
          onSelect={(value: string) => handleFilterChange('type', value)}
          width="w-36"
        />

        {/* 연도 필터 */}
        <FilterDropdown
          labelPrefix="연도"
          options={filterOptionsFormatted.year}
          selectedValue={filters.year}
          onSelect={(value: string) => handleFilterChange('year', value)}
          width="w-32"
        />

        {/* 핵심 역량 필터 */}
        <FilterDropdown
          labelPrefix="핵심 역량"
          options={filterOptionsFormatted.competency}
          selectedValue={filters.competency}
          onSelect={(value: string) => handleFilterChange('competency', value)}
          width="w-44"
        />
      </div>
    </div>
  );
};
