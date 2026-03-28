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

  if (!isAdmin) return <span>{params.row.mentorName}</span>;

  return (
    <SelectFormControl<number>
      value={localValue}
      onChange={handleChange}
      sx={{ '& .MuiSelect-select': { fontSize: '12px' } }}
      renderValue={(selected) => {
        const target = data?.mentorList.find(
          (item) => item.challengeMentorId === selected,
        );
        return target?.name || '없음';
      }}
    >
      <MenuItem value={NO_MENTOR_ID} sx={{ fontSize: '12px' }}>
        없음
      </MenuItem>
      {(data?.mentorList ?? []).map((item) => (
        <MenuItem
          key={`mentor-${item.challengeMentorId}`}
          value={item.challengeMentorId}
          sx={{ fontSize: '12px' }}
        >{`[${item.userId}] ${item.name}`}</MenuItem>
      ))}
    </SelectFormControl>
  );
};

export default MentorRenderCell;
