'use client';

import DataTable from '@/components/common/table/DataTable';
import BaseModal from '@/components/ui/BaseModal';
import { useState } from 'react';
import {
  ExperienceData,
  dummyExperiences,
  getExperienceHeaders,
} from '../../data';
import { ExperienceSelectModalFilters } from './ExperienceSelectModalFilters';
import { ExperienceSelectModalHeader } from './ExperienceSelectModalHeader';

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
  const [filters, setFilters] = useState({
    category: '전체',
    type: '전체',
    year: '전체',
    competency: '전체',
  });

  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const headers = getExperienceHeaders();

  const handleComplete = () => {
    const selectedExperiences = dummyExperiences.filter((experience) =>
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
              data={dummyExperiences}
              selectedRowIds={selectedRowIds}
              onSelectionChange={setSelectedRowIds}
            />
          </div>
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={handleComplete}
              className="rounded-xs bg-primary px-3 py-2.5 font-medium text-white"
            >
              {selectedRowIds.size}개 선택 완료
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
