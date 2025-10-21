'use client';

import BaseModal from '@/components/ui/BaseModal';
import { useState } from 'react';
import { ExperienceSelectModalFilters } from './ExperienceSelectModalFilters';
import { ExperienceSelectModalHeader } from './ExperienceSelectModalHeader';

interface ExperienceSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComplete: () => void;
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

  // TODO: 테이블 컴포넌트가 완성되면 경험 선택 로직 구현

  const handleComplete = () => {
    onSelectComplete();
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-4 h-[630px] w-[860px] max-w-6xl shadow-xl"
    >
      {/* 헤더 */}
      <ExperienceSelectModalHeader onClose={onClose} />

      {/* 필터 */}
      <ExperienceSelectModalFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="text-center text-gray-500">
          선택 가능한 테이블 컴포넌트
        </div>
      </div>

      {/* 푸터 */}
      <div className="px-6 py-4">
        <div className="flex justify-end">
          <button
            onClick={handleComplete}
            className="rounded-xs bg-primary px-3 py-2.5 font-medium text-white"
          >
            0개 선택 완료
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
