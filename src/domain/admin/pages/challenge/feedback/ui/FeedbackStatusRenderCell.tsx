'use client';

import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challenge/challengeSchema';
import { usePatchAdminAttendance } from '@/api/attendance/attendance';
import {
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
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AttendanceRow } from '../types';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

const FeedbackStatusEnumForMentor = FeedbackStatusEnum.exclude(['CONFIRMED']);

const FEEDBACK_STATUS_COLORS: Record<
  FeedbackStatus,
  { bg: string; text: string }
> = {
  WAITING: { bg: 'bg-neutral-90', text: 'text-neutral-30' },
  IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700' },
  CONFIRMED: { bg: 'bg-violet-50', text: 'text-violet-700' },
};

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
  const { snackbar } = useAdminSnackbar();

  const serverValue = params.value || FeedbackStatusEnum.enum.WAITING;
  const [localValue, setLocalValue] = useState<FeedbackStatus>(serverValue);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingValueRef = useRef<FeedbackStatus | null>(null);

  // query invalidation으로 서버 데이터가 갱신되면 localValue를 동기화
  useEffect(() => {
    setLocalValue(serverValue);
  }, [serverValue]);

  const invalidateFeedbackQueries = async () => {
    const feedbackQueryKey = isAdmin
      ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
      : [MentorMissionFeedbackAttendanceQueryKey, programId, missionId];

    await queryClient.invalidateQueries({ queryKey: feedbackQueryKey });
  };

  const applyChange = useCallback(async (newValue: FeedbackStatus) => {
    const prevValue = localValue;
    const attendanceId = params.row.id as number;

    setLocalValue(newValue);

    try {
      if (isAdmin === true) {
        await patchAdmin({ attendanceId, feedbackStatus: newValue });
      } else {
        await patchMentor({ attendanceId, feedbackStatus: newValue });
      }
      await invalidateFeedbackQueries();
      snackbar(`진행상태가 '${FeedbackStatusMapping[newValue]}'(으)로 변경되었습니다.`);
    } catch (error) {
      setLocalValue(prevValue);
      console.error('feedbackStatus 변경 실패:', error);
      snackbar('진행상태 변경에 실패했습니다.');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue, params.row.id, isAdmin]);

  const handleChange = (e: SelectChangeEvent<FeedbackStatus>) => {
    const newValue = e.target.value as FeedbackStatus;

    if (newValue === FeedbackStatusEnum.enum.COMPLETED) {
      pendingValueRef.current = newValue;
      setConfirmOpen(true);
      return;
    }

    applyChange(newValue);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (pendingValueRef.current) {
      applyChange(pendingValueRef.current);
      pendingValueRef.current = null;
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    pendingValueRef.current = null;
  };

  // 제출확인 전이면 드롭다운 비활성화
  if (params.row.status === 'ABSENT') {
    return (
      <span className="inline-flex items-center rounded-full bg-neutral-95 px-2 py-0.5 text-xxsmall12 font-medium text-neutral-40">
        확인전
      </span>
    );
  }

  if (!isAdmin && localValue === FeedbackStatusEnum.enum.CONFIRMED) {
    const color = FEEDBACK_STATUS_COLORS[localValue];
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xxsmall12 font-medium ${color.bg} ${color.text}`}
      >
        {FeedbackStatusMapping[localValue]}
      </span>
    );
  }

  return (
    <>
      <SelectFormControl<FeedbackStatus>
        value={localValue}
        renderValue={(selected) => {
          const color = FEEDBACK_STATUS_COLORS[selected];
          return (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xxsmall12 font-medium ${color.bg} ${color.text}`}
            >
              {FeedbackStatusMapping[selected]}
            </span>
          );
        }}
        onChange={handleChange}
        sx={{ '& .MuiSelect-select': { fontSize: '12px' } }}
      >
        {(isAdmin ? FeedbackStatusEnum : FeedbackStatusEnumForMentor).options.map(
          (item) => {
            const color = FEEDBACK_STATUS_COLORS[item];
            return (
              <MenuItem key={item} value={item} sx={{ fontSize: '12px' }}>
                <span
                  className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${color.bg}`}
                />
                {FeedbackStatusMapping[item]}
              </MenuItem>
            );
          },
        )}
      </SelectFormControl>

      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>진행완료로 변경하시겠습니까?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            진행완료로 변경하면 이후 상태를 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>취소</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            변경
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeedbackStatusRenderCell;
