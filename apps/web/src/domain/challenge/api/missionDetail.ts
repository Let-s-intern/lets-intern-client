import { userChallengeMissionDetail } from '@/schema';
import axios from '@/utils/axios';

/**
 * 데일리 미션 상세 조회 queryOptions.
 * queryKey는 기존 DailyMissionSection 의 useQuery 키와 동일하게 유지한다(캐시 호환).
 */
export const dailyMissionDetailQueryOptions = (
  challengeId: number | string,
  dailyMissionId: number | string,
) => ({
  queryKey: ['challenge', challengeId, 'mission', 'daily-mission-detail'],
  queryFn: async () => {
    const res = await axios.get(
      `challenge/${challengeId}/missions/${dailyMissionId}`,
    );
    return userChallengeMissionDetail.parse(res.data.data).missionInfo;
  },
});
