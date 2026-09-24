import { getChallengeIdPrimitiveSchema } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

/**
 * 멤버십 결제용 챌린지 조회 (client).
 *
 * 기존 `useChallengeQuery` 는 `getChallengeIdSchema`(날짜를 Dayjs 로 transform)를 반환하는데,
 * 재사용 대상인 `PricePlanBottomSheet` 는 `ChallengeIdPrimitive`(string 날짜)를 prop 으로 요구한다.
 * reuse 파일을 수정하지 않기 위해, 같은 `/challenge/{id}` 엔드포인트를 primitive 스키마로 파싱해
 * `PricePlanBottomSheet` 가 바로 받을 수 있는 형태로 반환한다.
 */
export const useMembershipChallengeQuery = ({
  challengeId,
  enabled = true,
}: {
  challengeId: number;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['membershipChallenge', challengeId],
    queryFn: async () => {
      const res = await axios.get(`/challenge/${challengeId}`);
      return getChallengeIdPrimitiveSchema.parse(res.data.data);
    },
  });
};
