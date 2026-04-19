'use client';

import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useMentorMatchContext } from '../MentorMatchContext';
import type { MentorAssignmentRow } from '../types';
import { getMentorLabel } from '../utils';

const NO_MENTOR_ID = 0;

const MentorSelectCell = (
  params: GridRenderCellParams<MentorAssignmentRow, number | null>,
) => {
  const { handleSingleMatch, mentors, isPending, getMentorColor } =
    useMentorMatchContext();

  const matchedId = params.row.matchedMentorId;

  const handleChange = async (e: SelectChangeEvent<number>) => {
    const challengeMentorId = e.target.value as number;
    if (challengeMentorId === NO_MENTOR_ID) return;
    await handleSingleMatch(params.row.id, challengeMentorId);
  };

  const mentorIndex = matchedId
    ? mentors.findIndex((m) => m.challengeMentorId === matchedId)
    : -1;
  const color = mentorIndex >= 0 ? getMentorColor(mentorIndex) : null;

  return (
    <SelectFormControl<number>
      value={matchedId ?? NO_MENTOR_ID}
      onChange={handleChange}
      disabled={isPending}
      sx={{ '& .MuiSelect-select': { fontSize: '12px' } }}
      renderValue={(selected) => {
        if (!selected) return '선택';
        const m = mentors.find((mt) => mt.challengeMentorId === selected);
        if (!m) return '선택';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xxsmall12 font-medium ${color?.bg ?? 'bg-neutral-90'} ${color?.text ?? 'text-neutral-40'}`}
          >
            {m.name}
          </span>
        );
      }}
    >
      <MenuItem value={NO_MENTOR_ID} sx={{ fontSize: '12px' }}>
        선택
      </MenuItem>
      {mentors.map((m) => (
        <MenuItem
          key={m.challengeMentorId}
          value={m.challengeMentorId}
          sx={{ fontSize: '12px' }}
        >
          {getMentorLabel(m)}
        </MenuItem>
      ))}
    </SelectFormControl>
  );
};

export default MentorSelectCell;
