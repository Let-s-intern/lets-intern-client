'use client';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import BulkAssignmentBar from './components/BulkAssignmentBar';
import MentorSelectCell from './cells/MentorSelectCell';
import MentorInfoCell from './cells/MentorInfoCell';
import useMentorAssignmentData from './hooks/useMentorAssignmentData';
import { MentorMatchContext } from './MentorMatchContext';
import MentorList from './components/MentorList';
import type { MentorAssignmentRow } from './types';
import { getMentorColor } from './utils';

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  LIGHT: { bg: 'bg-neutral-90', text: 'text-neutral-30' },
  BASIC: { bg: 'bg-blue-50', text: 'text-blue-700' },
  STANDARD: { bg: 'bg-violet-50', text: 'text-violet-700' },
  PREMIUM: { bg: 'bg-amber-50', text: 'text-amber-700' },
};

const columns: GridColDef<MentorAssignmentRow>[] = [
  {
    field: 'pricePlanType',
    headerName: '결제 상품',
    width: 100,
    renderCell: (params) => {
      const plan = params.value as string;
      const color = PLAN_COLORS[plan] ?? PLAN_COLORS.BASIC;
      return (
        <span
          className={`text-xxsmall12 inline-flex items-center rounded-full px-2 py-0.5 font-medium ${color.bg} ${color.text}`}
        >
          {plan}
        </span>
      );
    },
  },
  { field: 'name', headerName: '이름', width: 100 },
  {
    field: 'menteeInfo',
    headerName: '멘티 정보',
    width: 160,
    sortable: false,
    renderCell: (params) => {
      const { wishCompany, wishJob } = params.row;
      if (wishCompany === '-' && wishJob === '-')
        return <span className="text-neutral-40">-</span>;
      return (
        <div className="text-xxsmall12 flex flex-col py-1">
          <span className="text-neutral-30">{wishCompany}</span>
          <span className="text-neutral-40">{wishJob}</span>
        </div>
      );
    },
  },
  {
    field: 'matchedMentorId',
    headerName: '담당 멘토',
    width: 160,
    renderCell: MentorSelectCell,
  },
  {
    field: 'mentorInfo',
    headerName: '멘토 정보',
    width: 160,
    sortable: false,
    renderCell: MentorInfoCell,
  },
];

export default function MentorMenteeAssignment() {
  const { programId } = useParams<{ programId: string }>();

  const {
    rows,
    mentors,
    effectiveMentors,
    matchCounts,
    isLoading,
    isPending,
    handleSingleMatch,
    handleBulkMatch,
  } = useMentorAssignmentData(programId);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    [],
  );
  const [bulkMentorId, setBulkMentorId] = useState<number | ''>('');

  const handleBulkAssign = async () => {
    if (bulkMentorId === '') return;
    const ids = selectionModel as number[];
    if (ids.length === 0) return;

    await handleBulkMatch(bulkMentorId, ids);
    setSelectionModel([]);
    setBulkMentorId('');
  };

  const unassignedRows = useMemo(
    () => rows.filter((r) => r.matchedMentorId === null),
    [rows],
  );

  const handleSelectUnassigned = useCallback(() => {
    setSelectionModel(unassignedRows.map((r) => r.id));
  }, [unassignedRows]);

  const contextValue = useMemo(
    () => ({
      matchedMentors: effectiveMentors,
      mentors,
      handleSingleMatch,
      isPending,
      getMentorColor,
    }),
    [effectiveMentors, mentors, handleSingleMatch, isPending],
  );

  if (isLoading) {
    return (
      <div className="text-xsmall14 text-neutral-40 py-16 text-center">
        불러오는 중...
      </div>
    );
  }

  return (
    <MentorMatchContext.Provider value={contextValue}>
      <div>
        <MentorList mentors={mentors} matchCounts={matchCounts} />

        <BulkAssignmentBar
          mentors={mentors}
          bulkMentorId={bulkMentorId}
          onBulkMentorChange={setBulkMentorId}
          selectedCount={(selectionModel as number[]).length}
          isPending={isPending}
          onAssign={handleBulkAssign}
          unassignedCount={unassignedRows.length}
          onSelectUnassigned={handleSelectUnassigned}
        />

        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          hideFooter
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              overflow: 'visible',
              whiteSpace: 'normal',
              lineHeight: '1.4',
              py: 1,
            },
          }}
        />
      </div>
    </MentorMatchContext.Provider>
  );
}
