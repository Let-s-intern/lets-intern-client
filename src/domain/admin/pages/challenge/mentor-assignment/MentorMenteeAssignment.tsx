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

const columns: GridColDef<MentorAssignmentRow>[] = [
  { field: 'pricePlanType', headerName: '결제 상품', width: 100 },
  { field: 'name', headerName: '이름', width: 100 },
  { field: 'wishCompany', headerName: '희망 기업', width: 120 },
  { field: 'wishJob', headerName: '희망 직무', width: 150 },
  {
    field: 'matchedMentorId',
    headerName: '담당 멘토',
    width: 160,
    renderCell: MentorSelectCell,
  },
  {
    field: 'mentorInfo',
    headerName: '멘토 정보',
    width: 180,
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

  const handleSelectUnassigned = useCallback(() => {
    const unassignedIds = rows
      .filter((r) => r.matchedMentorId === null)
      .map((r) => r.id);
    setSelectionModel(unassignedIds);
  }, [rows]);

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
      <div className="py-16 text-center text-xsmall14 text-neutral-40">
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
