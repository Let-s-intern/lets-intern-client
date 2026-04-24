import {
  CreateLeadHistoryRequest,
  useCreateLeadHistoryMutation,
} from '@/api/lead';
import Heading from '@/domain/admin/ui/heading/Heading';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Button, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import useLeadHistoryColumns from './hooks/useLeadHistoryColumns';
import useLeadHistoryData from './hooks/useLeadHistoryData';
import useLeadHistoryFilter from './hooks/useLeadHistoryFilter';
import CreateLeadHistoryDialog from './modal/CreateLeadHistoryDialog';
import FilterGroupEditor from './section/FilterEditor';
import LeadHistoryTable from './ui/LeadHistoryTable';
import { downloadLeadHistoryCsv } from './utils/csv';

const LeadHistoryPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { snackbar } = useAdminSnackbar();

  const {
    allRows,
    aggregatedRows,
    isLoading,
    magnetOptions,
    magnetLabelMap,
    programOptions,
    magnetTypeOptions,
    magnetTypeLabelMap,
    groupSummaryMap,
  } = useLeadHistoryData();

  const {
    filterTree,
    filteredAggregatedRows,
    filteredGroupCount,
    totalGroupCount,
    rootHasChildren,
    callbacks,
    resetFilters,
  } = useLeadHistoryFilter({
    allRows,
    aggregatedRows,
    groupSummaryMap,
    magnetOptions,
    magnetLabelMap,
    programOptions,
    magnetTypeOptions,
    magnetTypeLabelMap,
  });

  const columns = useLeadHistoryColumns();

  const handleDownloadCsv = useCallback(() => {
    downloadLeadHistoryCsv(columns, filteredAggregatedRows);
  }, [columns, filteredAggregatedRows]);

  const createLeadHistory = useCreateLeadHistoryMutation();

  const handleCreate = async (payload: CreateLeadHistoryRequest) => {
    try {
      await createLeadHistory.mutateAsync(payload);
      snackbar('리드가 등록되었습니다.');
      setIsCreateOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      snackbar('등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <section className="p-5">
      <Heading className="mb-4">리드 관리</Heading>

      <div className="rounded mb-4 border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Typography className="text-xs text-gray-600">
            AND/OR 트리를 구성해 특정 마그넷·프로그램 참여 이력 여부로 전화번호
            그룹을 필터링할 수 있습니다.
          </Typography>
          <div className="ml-auto flex gap-1">
            <Button
              size="small"
              variant="text"
              onClick={resetFilters}
              disabled={!rootHasChildren}
            >
              조건 초기화
            </Button>
          </div>
        </div>

        <FilterGroupEditor node={filterTree} isRoot callbacks={callbacks} />

        <div className="mt-2 text-right text-[12px] text-gray-500">
          조건에 맞는 전화번호 그룹 {filteredGroupCount}/{totalGroupCount}개 ·
          리드 {filteredAggregatedRows.length}/{allRows.length}건
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={handleDownloadCsv}
            disabled={!filteredAggregatedRows.length}
          >
            CSV 내보내기
          </Button>
        </div>
      </div>

      <LeadHistoryTable
        data={filteredAggregatedRows}
        columns={columns}
        isLoading={isLoading}
      />

      <CreateLeadHistoryDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={createLeadHistory.isPending}
        magnetOptions={magnetOptions}
      />
    </section>
  );
};

export default LeadHistoryPage;
