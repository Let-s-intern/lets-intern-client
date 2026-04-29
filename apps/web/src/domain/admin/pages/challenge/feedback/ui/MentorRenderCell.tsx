'use client';

import { GridRenderCellParams } from '@mui/x-data-grid';
import type { AttendanceRow } from '../types';

/** 제출현황에서 담당 멘토를 읽기 전용으로 표시합니다. */
const MentorRenderCell = (
  params: GridRenderCellParams<AttendanceRow, number>,
) => {
  const name = params.row.mentorName;

  if (!name) {
    return <span className="text-xxsmall12 text-neutral-40">미배정</span>;
  }

  return (
    <span className="bg-neutral-90 text-xxsmall12 text-neutral-40 inline-flex items-center rounded-full px-2 py-0.5 font-medium">
      {name}
    </span>
  );
};

export default MentorRenderCell;
