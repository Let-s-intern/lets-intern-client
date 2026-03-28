'use client';

import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challenge/challengeSchema';
import { usePatchAttendanceMentor } from '@/api/attendance/attendance';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import type { AttendanceRow } from '../types';
import useAttendanceHandler from '../hooks/useAttendanceHandler';

const FeedbackStatusEnumForMentor = FeedbackStatusEnum.exclude(['CONFIRMED']);

const FeedbackStatusRenderCell = (
  params: GridRenderCellParams<AttendanceRow, FeedbackStatus>,
) => {
  const { data: isAdmin } = useIsAdminQuery();
  const { invalidateAttendance } = useAttendanceHandler();
  // v1 /attendance/{id}/mentor 엔드포인트 직접 사용
  // feedbackStatus만 전송 (feedback 필드 미포함 → 기존 피드백 내용 보존)
  const { mutateAsync: patchStatus } = usePatchAttendanceMentor();

  const serverValue = params.value || FeedbackStatusEnum.enum.WAITING;

  const [localValue, setLocalValue] = useState(serverValue);

  useEffect(() => {
    setLocalValue(serverValue);
  }, [serverValue]);

  const handleChange = async (e: SelectChangeEvent<FeedbackStatus>) => {
    const newValue = e.target.value as FeedbackStatus;
    setLocalValue(newValue);
    try {
      await patchStatus({
        attendanceId: params.row.id,
        feedbackStatus: newValue,
      });
      await invalidateAttendance();
    } catch {
      setLocalValue(serverValue);
    }
  };

  if (!isAdmin && params.value === FeedbackStatusEnum.enum.CONFIRMED) {
    return <span> {FeedbackStatusMapping[params.value]}</span>;
  }

  return (
    <SelectFormControl<FeedbackStatus>
      value={localValue}
      renderValue={(selected) => FeedbackStatusMapping[selected]}
      onChange={handleChange}
      sx={{ '& .MuiSelect-select': { fontSize: '12px' } }}
    >
      {(isAdmin ? FeedbackStatusEnum : FeedbackStatusEnumForMentor).options.map(
        (item) => (
          <MenuItem key={item} value={item} sx={{ fontSize: '12px' }}>
            {FeedbackStatusMapping[item]}
          </MenuItem>
        ),
      )}
    </SelectFormControl>
  );
};

export default FeedbackStatusRenderCell;
