'use client';

import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challenge/challengeSchema';
import { usePatchAdminAttendance } from '@/api/attendance/attendance';
import {
  ChallengeApplicationsQueryKey,
  ChallengeMissionFeedbackAttendanceQueryKey,
  MentorMissionFeedbackAttendanceQueryKey,
} from '@/api/challenge/challenge';
import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { AttendanceRow } from '../types';
import axios from '@/utils/axios';

const FeedbackStatusEnumForMentor = FeedbackStatusEnum.exclude(['CONFIRMED']);

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
  const queryClient = useQueryClient();

  const [localValue, setLocalValue] = useState<FeedbackStatus>(
    params.value || FeedbackStatusEnum.enum.WAITING,
  );

  const invalidateFeedbackQueries = async () => {
    const feedbackQueryKey = isAdmin
      ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
      : [MentorMissionFeedbackAttendanceQueryKey, programId, missionId];

    await queryClient.invalidateQueries({ queryKey: feedbackQueryKey });
    // fallback 경로의 캐시도 invalidate하여 stale 데이터 방지
    await queryClient.invalidateQueries({
      queryKey: [
        'admin',
        'challenge',
        Number(programId),
        'attendances',
        Number(missionId),
      ],
    });
  };

  const handleChange = async (e: SelectChangeEvent<FeedbackStatus>) => {
    const newValue = e.target.value as FeedbackStatus;
    const prevValue = localValue;
    const attendanceId = params.row.id as number;

    // Optimistic update
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
      // PATCH 성공 → query invalidation으로 서버 데이터 재조회
      await invalidateFeedbackQueries();
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
