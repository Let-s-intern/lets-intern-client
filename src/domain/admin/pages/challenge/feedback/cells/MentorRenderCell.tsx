'use client';

import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import type { AttendanceRow } from '../types';
import useAttendanceHandler from '../hooks/useAttendanceHandler';

const NO_MENTOR_ID = 0;

const MentorRenderCell = (
  params: GridRenderCellParams<AttendanceRow, number>,
) => {
  const { programId } = useParams<{ programId: string }>();

  const { patchAttendance, invalidateAttendance } = useAttendanceHandler();

  const { data: isAdmin } = useIsAdminQuery();
  const { data } = useAdminChallengeMentorListQuery(programId);
  const handleChange = async (e: SelectChangeEvent<number>) => {
    const attendanceId = params.row.id;
    await patchAttendance({
      attendanceId,
      mentorUserId: e.target.value as number,
    });
    await invalidateAttendance();
  };

  if (!isAdmin) return <span>{params.row.mentorName}</span>;

  // challengeMentorId → userId 변환 (PATCH API는 userId를 필요로 함)
  const currentMentor =
    params.value != null
      ? (data?.mentorList.find(
          (item) => item.challengeMentorId === params.value,
        ) ??
        data?.mentorList.find((item) => item.userId === params.value))
      : undefined;

  return (
    <SelectFormControl<number>
      value={currentMentor?.userId ?? NO_MENTOR_ID}
      onChange={handleChange}
      renderValue={(selected) => {
        const target = data?.mentorList.find(
          (item) => item.userId === selected,
        );
        return target?.name || '없음';
      }}
    >
      <MenuItem value={NO_MENTOR_ID}>없음</MenuItem>
      {(data?.mentorList ?? []).map((item) => (
        <MenuItem
          key={`mentor-${item.challengeMentorId}`}
          value={item.userId}
        >{`[${item.userId}] ${item.name}`}</MenuItem>
      ))}
    </SelectFormControl>
  );
};

export default MentorRenderCell;
