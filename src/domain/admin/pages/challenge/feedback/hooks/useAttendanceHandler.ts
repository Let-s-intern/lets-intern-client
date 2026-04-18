'use client';

import {
  usePatchAdminAttendance,
  usePatchAttendanceMentor,
} from '@/api/attendance/attendance';
import { ChallengeMissionFeedbackAttendanceQueryKey } from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { getMentorAttendanceQueryKey } from '@/domain/mentor/feedback/hooks/useMentorAttendanceQuery';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { useParams } from 'next/navigation';

const useAttendanceHandler = () => {
  const { programId, missionId } = useParams<{
    programId: string;
    missionId: string;
  }>();
  const { data: isAdmin } = useIsAdminQuery();

  const queryKey = isAdmin
    ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
    : [getMentorAttendanceQueryKey(programId), programId, missionId];

  const { mutateAsync: patchAdminAttendance } = usePatchAdminAttendance();
  const { mutateAsync: patchAttendanceMentor } = usePatchAttendanceMentor();
  const invalidateFeedback = useInvalidateQueries(queryKey);

  return {
    patchAttendance: isAdmin === true ? patchAdminAttendance : patchAttendanceMentor,
    invalidateAttendance: invalidateFeedback,
  };
};

export default useAttendanceHandler;
