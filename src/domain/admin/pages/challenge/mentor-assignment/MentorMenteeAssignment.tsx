'use client';

import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import BulkAssignmentBar from './components/BulkAssignmentBar';
import MentorSelectCell from './cells/MentorSelectCell';
import useMentorAssignmentData from './hooks/useMentorAssignmentData';
import { MentorMatchContext } from './MentorMatchContext';
import MentorList from './components/MentorList';
import type { MentorAssignmentRow } from './types';
import { getMentorColor } from './utils';

const columns: GridColDef<MentorAssignmentRow>[] = [
  { field: 'name', headerName: '이름', width: 120 },
  { field: 'email', headerName: '이메일', width: 200 },
  { field: 'phoneNum', headerName: '전화번호', width: 140 },
  {
    field: 'matchedMentorId',
    headerName: '멘토 배정',
    width: 180,
    renderCell: MentorSelectCell,
  },
];

export default function MentorMenteeAssignment() {
  const { programId } = useParams<{ programId: string }>();

  const {
    rows,
    mentors,
    effectiveMentors,
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
        <MentorList mentors={mentors} />

        <BulkAssignmentBar
          mentors={mentors}
          bulkMentorId={bulkMentorId}
          onBulkMentorChange={setBulkMentorId}
          selectedCount={(selectionModel as number[]).length}
          isPending={isPending}
          onAssign={handleBulkAssign}
        />

        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          hideFooter
          sx={{ '& .MuiDataGrid-cell': { overflow: 'visible' } }}
        />
      </div>
    </MentorMatchContext.Provider>
  );
}
