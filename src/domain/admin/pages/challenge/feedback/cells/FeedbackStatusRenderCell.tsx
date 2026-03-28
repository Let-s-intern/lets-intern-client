'use client';

import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challenge/challengeSchema';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import type { AttendanceRow } from '../types';
import useAttendanceHandler from '../hooks/useAttendanceHandler';

const FeedbackStatusEnumForMentor = FeedbackStatusEnum.exclude(['CONFIRMED']);

const FeedbackStatusRenderCell = (
  params: GridRenderCellParams<AttendanceRow, FeedbackStatus>,
) => {
  const { data: isAdmin } = useIsAdminQuery();
  const { patchAttendance, invalidateAttendance } = useAttendanceHandler();

  const handleChange = async (e: SelectChangeEvent<FeedbackStatus>) => {
    const attendanceId = params.row.id;

    await patchAttendance({
      attendanceId,
      feedbackStatus: e.target.value as FeedbackStatus,
    });
    await invalidateAttendance();
  };

  if (!isAdmin && params.value === FeedbackStatusEnum.enum.CONFIRMED) {
    return <span> {FeedbackStatusMapping[params.value]}</span>;
  }

  return (
    <SelectFormControl<FeedbackStatus>
      value={params.value || FeedbackStatusEnum.enum.WAITING}
      renderValue={(selected) => FeedbackStatusMapping[selected]}
      onChange={handleChange}
    >
      {(isAdmin ? FeedbackStatusEnum : FeedbackStatusEnumForMentor).options.map(
        (item) => (
          <MenuItem key={item} value={item}>
            {FeedbackStatusMapping[item]}{' '}
          </MenuItem>
        ),
      )}
    </SelectFormControl>
  );
};

export default FeedbackStatusRenderCell;
