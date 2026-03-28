'use client';

import {
  useChallengeMissionFeedbackAttendanceQuery,
  useMentorMissionFeedbackAttendanceQuery,
  useGetChallengeAttendances,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const useRoleBasedAttendanceData = () => {
  const { missionId, programId } = useParams<{
    missionId: string;
    programId: string;
  }>();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdminQuery();

  const { data: dataForAdmin } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && (isAdmin === true),
  });

  // feedback/attendances가 빈 배열이면 일반 attendances fallback
  const feedbackEmpty =
    isAdmin === true &&
    dataForAdmin != null &&
    dataForAdmin.attendanceList.length === 0;

  const { data: fallbackData } = useGetChallengeAttendances({
    challengeId: feedbackEmpty ? Number(programId) : undefined,
    detailedMissionId: feedbackEmpty ? Number(missionId) : undefined,
  });

  const adminData = useMemo(() => {
    if (dataForAdmin && dataForAdmin.attendanceList.length > 0)
      return dataForAdmin;
    if (fallbackData && fallbackData.length > 0) {
      return {
        attendanceList: fallbackData.map((item) => ({
          id: item.attendance.id,
          userId: item.attendance.userId ?? null,
          challengeMentorId: null as number | null,
          mentorId: null as number | null,
          mentorName: null as string | null,
          name: item.attendance.name ?? '',
          major: null as string | null,
          wishJob: null as string | null,
          wishCompany: null as string | null,
          link: item.attendance.link ?? null,
          status: (item.attendance.status ?? 'ABSENT') as
            | 'PRESENT'
            | 'UPDATED'
            | 'LATE'
            | 'ABSENT',
          result: (item.attendance.result ?? 'WAITING') as
            | 'WAITING'
            | 'PASS'
            | 'WRONG'
            | 'FINAL_WRONG',
          challengePricePlanType: 'BASIC' as
            | 'LIGHT'
            | 'BASIC'
            | 'STANDARD'
            | 'PREMIUM',
          feedbackStatus: 'WAITING' as
            | 'WAITING'
            | 'IN_PROGRESS'
            | 'COMPLETED'
            | 'CONFIRMED'
            | null,
          optionCode: null as string | null,
        })),
      };
    }
    return dataForAdmin;
  }, [dataForAdmin, fallbackData]);

  const { data: dataForMentor } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && (isAdmin === false),
  });

  return {
    isLoading: isAdminLoading,
    data: isAdmin ? adminData : dataForMentor,
  };
};

export default useRoleBasedAttendanceData;
