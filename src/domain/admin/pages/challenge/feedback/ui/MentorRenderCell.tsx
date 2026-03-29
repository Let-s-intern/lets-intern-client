'use client';

import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AttendanceRow } from '../types';
import useFeedbackMentorAssignment from '../hooks/useFeedbackMentorAssignment';
import { getMentorColor } from '../../mentor-colors';

const NO_MENTOR_ID = 0;

const MentorRenderCell = (
  params: GridRenderCellParams<AttendanceRow, number>,
) => {
  const { programId } = useParams<{ programId: string }>();

  const { assignMentor } = useFeedbackMentorAssignment();

  const { data: isAdmin } = useIsAdminQuery();
  const { data } = useAdminChallengeMentorListQuery(programId);

  const serverValue = params.value ?? NO_MENTOR_ID;

  // Optimistic local state: 드롭다운 선택 즉시 UI에 반영
  const [localValue, setLocalValue] = useState(serverValue);

  useEffect(() => {
    setLocalValue(serverValue);
  }, [serverValue]);

  const handleChange = async (e: SelectChangeEvent<number>) => {
    const selectedChallengeMentorId = e.target.value as number;
    if (selectedChallengeMentorId === NO_MENTOR_ID) return;

    setLocalValue(selectedChallengeMentorId);
    try {
      await assignMentor({
        participantName: params.row.name,
        challengeMentorId: selectedChallengeMentorId,
      });
    } catch {
      setLocalValue(serverValue);
    }
  };

  const mentorList = data?.mentorList ?? [];

  const getMentorColorByIdFromList = (id: number) => {
    const idx = mentorList.findIndex((m) => m.challengeMentorId === id);
    return idx >= 0 ? getMentorColor(idx) : null;
  };

  if (!isAdmin) return <span>{params.row.mentorName}</span>;

  const selectedColor = getMentorColorByIdFromList(localValue);

  return (
    <SelectFormControl<number>
      value={localValue}
      onChange={handleChange}
      sx={{ '& .MuiSelect-select': { fontSize: '12px' } }}
      renderValue={(selected) => {
        const target = mentorList.find(
          (item) => item.challengeMentorId === selected,
        );
        if (!target) return '없음';
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xxsmall12 font-medium ${selectedColor?.bg ?? 'bg-neutral-90'} ${selectedColor?.text ?? 'text-neutral-40'}`}
          >
            {target.name}
          </span>
        );
      }}
    >
      <MenuItem value={NO_MENTOR_ID} sx={{ fontSize: '12px' }}>
        없음
      </MenuItem>
      {mentorList.map((item, idx) => {
        const color = getMentorColor(idx);
        return (
          <MenuItem
            key={`mentor-${item.challengeMentorId}`}
            value={item.challengeMentorId}
            sx={{ fontSize: '12px' }}
          >
            <span
              className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${color.bg}`}
            />
            {`[${item.userId}] ${item.name}`}
          </MenuItem>
        );
      })}
    </SelectFormControl>
  );
};

export default MentorRenderCell;
