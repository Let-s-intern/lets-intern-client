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
  if (!career?.company && !career?.job) return <span className="text-neutral-40">-</span>;

  return (
    <span className="text-xxsmall12 text-neutral-30">
      {[career.company, career.job].filter(Boolean).join(' / ')}
    </span>
  );
};

export default MentorInfoCell;
