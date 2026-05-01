import {
  challengeMissionFeedbackAttendanceListSchema,
  ChallengeMissionFeedbackList,
} from '@/api/challenge/challengeSchema';
import axiosV2 from '@/utils/axiosV2';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

interface MissionCounts {
  submittedCount: number;
  totalCount: number;
}

/**
 * 230 미만(legacy) 챌린지의 미션별 제출/전체 카운트를 attendance(/prev) 에서 산출.
 *
 * 배경: legacy /prev 의 mission/feedback 응답은 submittedCount/totalCount 가 0/null
 * 로 내려와 그대로 표시할 수 없다. attendance 데이터에는 status (ABSENT/...) 가
 * 들어 있으므로 미션별로 attendances/prev 를 병렬 조회해 직접 계산한다.
 *
 *   - totalCount     = attendanceList.length          (해당 미션 명단 전체)
 *   - submittedCount = status !== 'ABSENT' 인 항목 수 (실제 제출자)
 */
export function useLegacyMissionCounts({
  challengeId,
  enabled,
  missionsData,
}: {
  challengeId?: string | number;
  enabled: boolean;
  missionsData?: ChallengeMissionFeedbackList;
}): Record<number, MissionCounts> {
  const missionIds = useMemo(
    () => (missionsData?.missionList ?? []).map((m) => m.id),
    [missionsData],
  );

  const attendanceQueries = useQueries({
    queries: missionIds.map((missionId) => ({
      queryKey: [
        'legacyMissionCounts',
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

    const result: Record<number, MissionCounts> = {};
    missionIds.forEach((missionId, idx) => {
      const list = attendanceQueries[idx]?.data?.attendanceList;
      if (!list) return;
      result[missionId] = {
        totalCount: list.length,
        submittedCount: list.filter((a) => a.status !== 'ABSENT').length,
      };
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    missionIds.join(','),
    attendanceQueries.map((q) => q.data).join(','),
  ]);
}
