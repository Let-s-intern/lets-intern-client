import { CreateChallengeReq, UpdateChallengeReq } from '@/schema';
import { useMemo } from 'react';

/**
 * 챌린지 생성/수정 페이지에서 공통으로 사용할 훅을 모아두자
 * 점진적으로 개선해나가자...
 */
export default function useAdminChallenge(
  challengeInput?: Omit<UpdateChallengeReq | CreateChallengeReq, 'desc'>,
) {
  // 챌린지 가격 = 이용료 + 보증금 - 할인 금액
  const challengePrice = useMemo(() => {
    if (!challengeInput?.priceInfo) return 0;

    const { charge, refund, priceInfo } = challengeInput?.priceInfo[0];
    return (
      (charge ?? priceInfo.price ?? 0) +
      (refund ?? 0) -
      (priceInfo.discount ?? 0)
    );
  }, [challengeInput?.priceInfo?.[0]]);

  return { challengePrice };
}
