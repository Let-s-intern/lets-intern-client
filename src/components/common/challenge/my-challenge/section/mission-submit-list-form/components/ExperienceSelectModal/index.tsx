'use client';

import MuiPagination from '@/components/common/program/pagination/MuiPagination';
import DataTable from '@/components/common/table/DataTable';
import BaseModal from '@/components/ui/BaseModal';
import { useExperienceSelectModal } from '@/hooks/useExperienceSelectModal';
import { getExperienceRowHeight } from '@/utils/experience';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { Dayjs } from 'dayjs';
import { ExperienceData, getExperienceHeaders } from '../../data';
import { ExperienceSelectModalFilters } from './components/ExperienceSelectModalFilters';
import { ExperienceSelectModalHeader } from './components/ExperienceSelectModalHeader';

interface ExperienceSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComplete: (selectedExperiences: ExperienceData[]) => void;
  missionStartDate?: Dayjs | null;
}

const PAGE_SIZE = 8;

export const ExperienceSelectModal = ({
  isOpen,
  onClose,
  onSelectComplete,
  missionStartDate,
}: ExperienceSelectModalProps) => {
  const { filters, pagination, data, selection, handleComplete } =
    useExperienceSelectModal({
      isOpen,
      pageSize: PAGE_SIZE,
      missionStartDate,
    });

  const headers = getExperienceHeaders();

  const onCompleteClick = () => {
    handleComplete(onSelectComplete, onClose);
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
          filters={filters.value}
          onFiltersChange={filters.onChange}
          filterOptions={filters.options}
        />
        {/* 테이블 */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="h-full overflow-auto rounded-xxs border border-neutral-80">
            {data.isLoading ? (
              <div className="flex h-full items-center justify-center">
                <LoadingContainer text="경험정리를 불러오는 중입니다.." />
              </div>
            ) : (
              <DataTable
                headers={headers}
                data={data.experiences.map((exp) => ({
                  ...exp,
                  id: exp.originalId,
                }))}
                selectedRowIds={
                  new Set(
                    Array.from(selection.selectedRowIds).map((id) =>
                      Number(id),
                    ),
                  )
                }
                onSelectionChange={(selectedIds) => {
                  selection.setSelectedRowIds(
                    new Set(Array.from(selectedIds).map(String)),
                  );
                }}
                getRowHeight={getExperienceRowHeight}
              />
            )}
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="px-6 py-2">
          <MuiPagination
            page={pagination.currentPage}
            onChange={pagination.handlePageChange}
            pageInfo={{
              pageNum: pagination.currentPage,
              pageSize: PAGE_SIZE,
              totalElements: pagination.totalElements,
              totalPages: pagination.totalPages,
            }}
          />
        </div>
        {/* 푸터 */}
        <div className="px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onCompleteClick}
              disabled={selection.selectedCount < 3}
              className={`rounded-xs px-3 py-2.5 font-medium ${
                selection.selectedCount >= 3
                  ? 'bg-primary text-white'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            >
              {selection.selectedCount}개 선택 완료
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
