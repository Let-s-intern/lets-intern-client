import {
  challengeMissionFeedbackAttendanceListSchema,
  ChallengeMissionFeedbackList,
} from '@/api/challenge/challengeSchema';
import axiosV2 from '@/utils/axiosV2';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

/**
 * 230 미만(legacy) 챌린지의 멘토 배정 정보를 attendance(/prev) 데이터에서 역산한다.
 *
 * 배경: legacy 챌린지는 application.challengeMentorId 가 null 로 내려온다
 * (BE 확인: ch50, ch200 모두 null). 멘토 정보는 미션별 attendance row 에만 존재.
 * application 에는 userId 필드도 없어 attendance 와 직접 키 매칭이 불가하므로
 * `name` 으로 join 한다(같은 챌린지 내 동명이인 가능성은 사실상 무시).
 *
 * 동작:
 *  1) `missionsData.missionList` 의 각 missionId 에 대해
 *     `/admin/challenge/{id}/mission/{missionId}/feedback/attendances/prev` 를 병렬 조회
 *  2) attendance.name → 가장 마지막에 본 non-null mentorId 로 누적
 *  3) applicationsData 를 사용해 name → applicationId 로 변환하여 반환
 */
export function useLegacyMentorAssignmentMap({
  challengeId,
  enabled,
  missionsData,
  applicationsData,
}: {
  challengeId?: string;
  enabled: boolean;
  missionsData?: ChallengeMissionFeedbackList;
  // 호출처(useChallengeApplicationsQuery) 의 정확한 타입에 의존하지 않도록
  // 필요한 필드만 가진 최소 shape 로 받는다 — id/name 외 필드는 모두 존재 여부만.
  applicationsData?: {
    applicationList: Array<{
      application: {
        id?: number | null;
        name?: string | null;
        [key: string]: unknown;
      };
    }>;
  };
}): Record<number, number> {
  const missionIds = useMemo(
    () => (missionsData?.missionList ?? []).map((m) => m.id),
    [missionsData],
  );

  const attendanceQueries = useQueries({
    queries: missionIds.map((missionId) => ({
      queryKey: [
        'legacyMentorAttendance',
        challengeId,
        missionId,
        'prev',
      ] as const,
      queryFn: async () => {
        const res = await axiosV2.get(
          `/admin/challenge/${challengeId}/mission/${missionId}/feedback/attendances/prev`,
        );
        return challengeMissionFeedbackAttendanceListSchema.parse(
          res.data.data,
        );
      },
      enabled: enabled && !!challengeId && !!missionId,
    })),
  });

  return useMemo(() => {
    if (!enabled) return {};

    // name → mentorId (마지막 non-null 우선)
    const nameToMentor: Record<string, number> = {};
    attendanceQueries.forEach((q) => {
      q.data?.attendanceList.forEach((att) => {
        const mentorId = att.challengeMentorId;
        if (att.name && mentorId != null) {
          nameToMentor[att.name] = mentorId;
        }
      });
    });

    // name → applicationId 로 join
    const result: Record<number, number> = {};
    applicationsData?.applicationList.forEach((a) => {
      const name = a.application.name;
      const appId = a.application.id;
      if (name && appId != null && nameToMentor[name] != null) {
        result[appId] = nameToMentor[name];
      }
    });
    return result;
    // attendanceQueries 는 매 렌더마다 새 배열 reference 라 length 와 data 의 합으로 의존성 표현
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    applicationsData,
    attendanceQueries.map((q) => q.data).join(','),
  ]);
}
