'use client';

import {
  usePatchAdminAttendance,
  usePatchAttendanceMentor,
} from '@/api/attendance/attendance';
import {
  ChallengeApplicationsQueryKey,
  ChallengeMissionFeedbackAttendanceQueryKey,
  MentorMissionFeedbackAttendanceQueryKey,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const useAttendanceHandler = () => {
  const { programId, missionId } = useParams<{
    programId: string;
    missionId: string;
  }>();
  const { data: isAdmin } = useIsAdminQuery();

  const queryKey = isAdmin
    ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
    : [MentorMissionFeedbackAttendanceQueryKey, programId, missionId];

  const { mutateAsync: patchAdminAttendance } = usePatchAdminAttendance();
  const { mutateAsync: patchAttendanceMentor } = usePatchAttendanceMentor();
  const invalidateFeedback = useInvalidateQueries(queryKey);
  const queryClient = useQueryClient();

  const invalidateAttendance = async () => {
    await invalidateFeedback();
    await queryClient.invalidateQueries({
      queryKey: ['admin', 'challenge', Number(programId), 'attendances', Number(missionId)],
    });
    await queryClient.invalidateQueries({
      queryKey: [ChallengeApplicationsQueryKey, programId],
    });
  };

  return {
    patchAttendance: isAdmin ? patchAdminAttendance : patchAttendanceMentor,
    invalidateAttendance,
  };
};

export default useAttendanceHandler;
