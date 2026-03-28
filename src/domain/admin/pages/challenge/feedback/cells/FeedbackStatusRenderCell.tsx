'use client';

import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challenge/challengeSchema';
import { usePatchAdminAttendance } from '@/api/attendance/attendance';
import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { AttendanceRow } from '../types';
import axios from '@/utils/axios';

const FeedbackStatusEnumForMentor = FeedbackStatusEnum.exclude(['CONFIRMED']);

// fallback 엔드포인트가 feedbackStatus를 반환하지 않으므로
// PATCH 성공 값을 모듈 레벨에서 캐시하여 페이지 이동 후에도 유지
const statusCache = new Map<number | string, FeedbackStatus>();

const FeedbackStatusRenderCell = (
  params: GridRenderCellParams<AttendanceRow, FeedbackStatus>,
) => {
  const { programId, missionId } = useParams<{
    programId: string;
    missionId: string;
  }>();
  const { data: isAdmin } = useIsAdminQuery();
  const { mutateAsync: patchAdmin } = usePatchAdminAttendance();
  const { mutateAsync: patchMentor } = usePatchAttendanceMentorMutation();

  // 초기값: 캐시 → 서버값 → WAITING 순으로 결정
  const initialValue =
    statusCache.get(params.row.id) ||
    params.value ||
    FeedbackStatusEnum.enum.WAITING;

  const [localValue, setLocalValue] = useState<FeedbackStatus>(initialValue);

  const handleChange = async (e: SelectChangeEvent<FeedbackStatus>) => {
    const newValue = e.target.value as FeedbackStatus;
    const prevValue = localValue;
    const attendanceId = params.row.id as number;

    setLocalValue(newValue);

    try {
      if (isAdmin) {
        await patchAdmin({ attendanceId, feedbackStatus: newValue });
      } else {
        const res = await axios.get(
          `/challenge/${programId}/mission/${missionId}/feedback/attendances/${attendanceId}`,
        );
        const currentFeedback =
          res.data.data?.attendanceDetailVo?.feedback ?? '';

        await patchMentor({
          attendanceId,
          feedback: currentFeedback,
          feedbackStatus: newValue,
        });
      }
      // PATCH 성공 → 캐시에 저장 (re-mount 시에도 유지)
      statusCache.set(params.row.id, newValue);
    } catch (error) {
      setLocalValue(prevValue);
      console.error('feedbackStatus 변경 실패:', error);
    }
  };

  if (!isAdmin && localValue === FeedbackStatusEnum.enum.CONFIRMED) {
    return <span>{FeedbackStatusMapping[localValue]}</span>;
  }

  return (
    <SelectFormControl<FeedbackStatus>
      value={localValue}
      renderValue={(selected) => FeedbackStatusMapping[selected]}
      onChange={handleChange}
    >
      {(isAdmin ? FeedbackStatusEnum : FeedbackStatusEnumForMentor).options.map(
        (item) => (
          <MenuItem key={item} value={item}>
            {FeedbackStatusMapping[item]}
          </MenuItem>
        ),
      )}
    </SelectFormControl>
  );
};

export default FeedbackStatusRenderCell;
