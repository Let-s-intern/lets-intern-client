'use client';

import {
  useGetMembershipPrivilege,
  useGetOpenMembershipPrivilege,
} from '@/domain/all-in-one-pass/api/privilege';

interface PlanPrices {
  basicRegularPrice: number;
  basicDiscountAmount: number;
  standardRegularPrice: number;
  standardDiscountAmount: number;
  premiumRegularPrice: number;
  premiumDiscountAmount: number;
}

/**
 * 챌린지 바텀시트 올인원패스 혜택 — 패스회원가 계산 + 권한/업셀 판정.
 * enabled(=showMembershipBenefit)가 false면 호출 안 되고 결과도 비활성(멤버십 랜딩 보호).
 * 패스회원가 = max(플랜 판매가 − BASIC 판매가, 0). LIGHT는 혜택 제외라 여기 없음.
 */
export const useChallengePassBenefit = ({
  challengeId,
  enabled,
  prices,
}: {
  challengeId: string;
  enabled: boolean;
  prices: PlanPrices;
}) => {
  const { data: privilege } = useGetMembershipPrivilege(
    'CHALLENGE',
    enabled ? Number(challengeId) : -1,
  );
  const { data: openPrivilege } = useGetOpenMembershipPrivilege({ enabled });

  const hasPrivilege = enabled && (privilege?.hasPrivilege ?? false);
  // 비보유자: 열린 패스에 CHALLENGE 권한이 있을 때만 패스회원가·업셀 노출
  const openHasChallenge =
    enabled &&
    !!openPrivilege?.exists &&
    openPrivilege.privilegeList.some((p) => p.programType === 'CHALLENGE');
  const showPassPrice = hasPrivilege || openHasChallenge;

  const basicSellingPrice = Math.max(
    prices.basicRegularPrice - prices.basicDiscountAmount,
    0,
  );
  const passPriceOf = (regular: number, discount: number) =>
    Math.max(regular - discount - basicSellingPrice, 0);

  const passPrices = {
    BASIC: passPriceOf(prices.basicRegularPrice, prices.basicDiscountAmount),
    STANDARD: passPriceOf(
      prices.standardRegularPrice,
      prices.standardDiscountAmount,
    ),
    PREMIUM: passPriceOf(
      prices.premiumRegularPrice,
      prices.premiumDiscountAmount,
    ),
  };

  return {
    hasPrivilege,
    showPassPrice,
    openMembershipId: openPrivilege?.membershipId ?? null,
    passPrices,
  };
};
