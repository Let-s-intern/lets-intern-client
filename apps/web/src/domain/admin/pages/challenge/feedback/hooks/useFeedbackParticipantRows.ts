'use client';

import { FeedbackStatusEnum } from '@/api/challenge/challengeSchema';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import type { AttendanceRow } from '../types';
import useRoleBasedAttendanceData from './useRoleBasedAttendanceData';

const useSelectedMission = () => {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('mission') || '{}');
    } catch {
      return {};
    }
  }, []);
};

export { useSelectedMission };

const useFeedbackParticipantRows = (): AttendanceRow[] => {
  const { missionId, programId } = useParams();
  const { data } = useRoleBasedAttendanceData();
  const selectedMission = useSelectedMission();

  return useMemo(
    () =>
      (data?.attendanceList ?? []).map(
        ({ result: _r, challengePricePlanType: _c, ...rest }) => ({
          ...rest,
          status: rest.status ?? 'ABSENT',
          missionTitle: selectedMission.title ?? '',
          missionRound: selectedMission.th ?? '',
          feedbackStatus:
            (rest.feedbackStatus as string) ?? FeedbackStatusEnum.enum.WAITING,
          feedbackPageLink: `/admin/challenge/operation/${programId}/mission/${missionId}/participant/${rest.id}/feedback`,
        }),
      ),
    [data, selectedMission, programId, missionId],
  );
};

export default useFeedbackParticipantRows;
