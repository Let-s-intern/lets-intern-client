'use client';

import {
  useChallengeMissionFeedbackAttendanceQuery,
  useMentorMissionFeedbackAttendanceQuery,
  useGetChallengeAttendances,
  useChallengeApplicationsQuery,
  ChallengeMissionFeedbackAttendanceQueryKey,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const useRoleBasedAttendanceData = () => {
  const { missionId, programId } = useParams<{
    missionId: string;
    programId: string;
  }>();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdminQuery();
  const queryClient = useQueryClient();

  const { data: dataForAdmin } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && isAdmin === true,
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

  // fallback 시 applications에서 멘토 배정 정보를 가져옴
  const { data: applicationsData } = useChallengeApplicationsQuery({
    challengeId: feedbackEmpty ? programId : undefined,
    enabled: feedbackEmpty,
  });

  const adminData = useMemo(() => {
    if (dataForAdmin && dataForAdmin.attendanceList.length > 0)
      return dataForAdmin;
    if (fallbackData && fallbackData.length > 0) {
      // 일반 attendance API는 feedbackStatus를 반환하지 않으므로,
      // feedback attendance query 캐시에서 이전에 저장된 feedbackStatus를 가져온다.
      const cachedFeedbackData = queryClient.getQueryData<{
        attendanceList: Array<{ id: number; feedbackStatus?: string | null }>;
      }>([ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]);

      const feedbackStatusMap = new Map<number, string | null>();
      cachedFeedbackData?.attendanceList.forEach((item) => {
        feedbackStatusMap.set(item.id, item.feedbackStatus ?? null);
      });

      return {
        attendanceList: fallbackData.map((item) => {
          // applications 데이터에서 이름으로 멘토 배정 정보 매핑
          const matchedApp = applicationsData?.applicationList.find(
            (a) => a.application.name === item.attendance.name,
          );
          // 캐시된 feedbackStatus가 있으면 사용, 없으면 attendance 데이터 사용
          const cachedStatus = feedbackStatusMap.get(item.attendance.id);
          return {
            id: item.attendance.id,
            userId: item.attendance.userId ?? null,
            challengeMentorId:
              (item.attendance.challengeMentorId as number | null) ??
              (matchedApp?.application.challengeMentorId as number | null) ??
              null,
            mentorId: null as number | null,
            mentorName:
              (item.attendance.mentorName as string | null) ??
              (matchedApp?.application.challengeMentorName as string | null) ??
              null,
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
            feedbackStatus: (cachedStatus ??
              item.attendance.feedbackStatus ??
              'WAITING') as
              | 'WAITING'
              | 'IN_PROGRESS'
              | 'COMPLETED'
              | 'CONFIRMED'
              | null,
            optionCode: null as string | null,
          };
        }),
      };
    }
    return dataForAdmin;
  }, [dataForAdmin, fallbackData, applicationsData, queryClient, programId, missionId]);

  const { data: dataForMentor } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && isAdmin === false,
  });

  return {
    isLoading: isAdminLoading,
    data: isAdmin ? adminData : dataForMentor,
  };
};

export default useRoleBasedAttendanceData;
