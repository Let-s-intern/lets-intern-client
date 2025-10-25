'use client';

import { useState } from 'react';

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
    { value: '전체', label: '경험 분류 전체' },
    { value: '프로젝트', label: '프로젝트' },
    { value: '인턴십', label: '인턴십' },
    { value: '동아리', label: '동아리' },
    { value: '봉사', label: '봉사' },
    { value: '기타', label: '기타' },
  ],
  type: [
    { value: '전체', label: '팀·개인 전체' },
    { value: '팀', label: '팀' },
    { value: '개인', label: '개인' },
  ],
  year: [
    { value: '전체', label: '연도 전체' },
    { value: '2025', label: '2025년' },
    { value: '2024', label: '2024년' },
    { value: '2023', label: '2023년' },
    { value: '2022', label: '2022년' },
    { value: '2021', label: '2021년' },
  ],
  competency: [
    { value: '전체', label: '핵심 역량 전체' },
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
  const [isOpen, setIsOpen] = useState<{
    category: boolean;
    type: boolean;
    year: boolean;
    competency: boolean;
  }>({
    category: false,
    type: false,
    year: false,
    competency: false,
  });

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    onFiltersChange({
      ...filters,
      [filterType]: value,
    });
    setIsOpen((prev) => ({
      ...prev,
      [filterType]: false,
    }));
  };

  const toggleDropdown = (filterType: keyof Filters) => {
    setIsOpen((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const getFilterLabel = (filterType: keyof Filters) => {
    const options = FILTER_OPTIONS[filterType];
    const selectedOption = options.find(
      (option) => option.value === filters[filterType],
    );
    return selectedOption?.label || options[0].label;
  };

  return (
    <div className="px-6 py-4">
      <div className="flex gap-3">
        {/* 경험 분류 필터 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('category')}
            className="flex w-48 items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>{getFilterLabel('category')}</span>
            <svg
              className={`h-4 w-4 transition-transform ${
                isOpen.category ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isOpen.category && (
            <div className="absolute z-10 mt-1 w-48 rounded-sm border border-gray-300 bg-white shadow-lg">
              {FILTER_OPTIONS.category.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange('category', option.value)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 팀·개인 필터 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('type')}
            className="flex w-32 items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>{getFilterLabel('type')}</span>
            <svg
              className={`h-4 w-4 transition-transform ${
                isOpen.type ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isOpen.type && (
            <div className="absolute z-10 mt-1 w-32 rounded-sm border border-gray-300 bg-white shadow-lg">
              {FILTER_OPTIONS.type.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange('type', option.value)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 연도 필터 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('year')}
            className="flex w-28 items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>{getFilterLabel('year')}</span>
            <svg
              className={`h-4 w-4 transition-transform ${
                isOpen.year ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isOpen.year && (
            <div className="absolute z-10 mt-1 w-28 rounded-sm border border-gray-300 bg-white shadow-lg">
              {FILTER_OPTIONS.year.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange('year', option.value)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 핵심 역량 필터 */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleDropdown('competency')}
            className="flex w-40 items-center justify-between rounded-sm border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>{getFilterLabel('competency')}</span>
            <svg
              className={`h-4 w-4 transition-transform ${
                isOpen.competency ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isOpen.competency && (
            <div className="absolute z-10 mt-1 w-40 rounded-sm border border-gray-300 bg-white shadow-lg">
              {FILTER_OPTIONS.competency.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFilterChange('competency', option.value)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
