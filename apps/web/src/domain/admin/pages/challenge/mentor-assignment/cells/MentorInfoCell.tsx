'use client';

import { GridRenderCellParams } from '@mui/x-data-grid';
import { useMentorMatchContext } from '../MentorMatchContext';
import type { MentorAssignmentRow } from '../types';

const MentorInfoCell = (
  params: GridRenderCellParams<MentorAssignmentRow, number | null>,
) => {
  const { mentors } = useMentorMatchContext();
  const matchedId = params.row.matchedMentorId;

  if (!matchedId) return <span className="text-neutral-40">-</span>;

  const mentor = mentors.find((m) => m.challengeMentorId === matchedId);
  if (!mentor) return <span className="text-neutral-40">-</span>;

  const career = mentor.userCareerList?.[0];
  if (!career?.company && !career?.job)
    return <span className="text-neutral-40">-</span>;

  return (
    <div className="text-xxsmall12 flex flex-col py-1">
      <span className="text-neutral-30">{career.company ?? '-'}</span>
      <span className="text-neutral-40">{career.job ?? '-'}</span>
    </div>
  );
};

export default MentorInfoCell;
