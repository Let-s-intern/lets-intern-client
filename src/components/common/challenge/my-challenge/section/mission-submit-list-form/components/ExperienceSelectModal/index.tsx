'use client';

import MuiPagination from '@/components/common/program/pagination/MuiPagination';
import DataTable from '@/components/common/table/DataTable';
import BaseModal from '@/components/ui/BaseModal';
import { useEffect, useState } from 'react';
import {
  ExperienceData,
  dummyExperiences,
  getExperienceHeaders,
} from '../../data';
import { ExperienceSelectModalFilters } from './components/ExperienceSelectModalFilters';
import { ExperienceSelectModalHeader } from './components/ExperienceSelectModalHeader';
interface ExperienceSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComplete: (selectedExperiences: ExperienceData[]) => void;
}

export const ExperienceSelectModal = ({
  isOpen,
  onClose,
  onSelectComplete,
}: ExperienceSelectModalProps) => {
  const PAGE_SIZE = 5;

  const [filters, setFilters] = useState({
    category: '전체',
    type: '전체',
    year: '전체',
    competency: '전체',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const headers = getExperienceHeaders();

  // 필터링된 경험 데이터
  const filteredExperiences = dummyExperiences.filter((experience) => {
    // 경험 분류 필터
    if (
      filters.category !== '전체' &&
      experience.category !== filters.category
    ) {
      return false;
    }

    // 팀·개인 필터
    if (filters.type !== '전체' && experience.type !== filters.type) {
      return false;
    }

    // 연도 필터
    if (filters.year !== '전체' && experience.year !== parseInt(filters.year)) {
      return false;
    }

    // 핵심 역량 필터
    if (filters.competency !== '전체') {
      const hasCompetency = experience.coreCompetencies.some((comp) =>
        comp.toLowerCase().includes(filters.competency.toLowerCase()),
      );
      if (!hasCompetency) {
        return false;
      }
    }

    return true;
  });

  // 페이지네이션 로직
  const totalPages = Math.ceil(filteredExperiences.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedExperiences = filteredExperiences.slice(startIndex, endIndex);

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
  };

  const handleComplete = () => {
    const selectedExperiences = filteredExperiences.filter((experience) =>
      selectedRowIds.has(experience.id),
    );
    onSelectComplete(selectedExperiences);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 h-[630px] w-[860px] max-w-6xl shadow-xl"
    >
      <div className="flex h-full flex-col">
        {/* 헤더 */}
        <ExperienceSelectModalHeader onClose={onClose} />
        {/* 필터 */}
        <ExperienceSelectModalFilters
          filters={filters}
          onFiltersChange={setFilters}
        />
        {/* 테이블 */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="h-full overflow-auto rounded-xxs border border-neutral-80">
            <DataTable
              headers={headers}
              data={paginatedExperiences}
              selectedRowIds={selectedRowIds}
              onSelectionChange={setSelectedRowIds}
            />
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="px-6 py-2">
          <MuiPagination
            page={currentPage}
            onChange={handlePageChange}
            pageInfo={{
              pageNum: currentPage,
              pageSize: PAGE_SIZE,
              totalElements: filteredExperiences.length,
              totalPages,
            }}
          />
        </div>
        {/* 푸터 */}
        <div className="px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={handleComplete}
              disabled={selectedRowIds.size < 3}
              className={`rounded-xs px-3 py-2.5 font-medium ${
                selectedRowIds.size >= 3
                  ? 'bg-primary text-white'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            >
              {selectedRowIds.size}개 선택 완료
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
