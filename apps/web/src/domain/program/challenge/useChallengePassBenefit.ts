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
 * 패스회원가 = max(플랜 판매가 − BASIC 판매가, 0). LIGHT는 0원이다.
 * 서버는 패스 권한이 있으면 플랜과 관계없이 이용료를 0원으로 계산한다. LIGHT 를 정가로 받으면
 * 결제 금액이 서버와 어긋나 INVALID_PRICE 로 거절된다. BASIC 이 이미 0원이라 LIGHT 를 0원으로 줘도 손해가 없다.
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
    LIGHT: 0,
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

  const openMembershipId = openPrivilege?.membershipId ?? null;
  const multiOpen = (openPrivilege?.openCount ?? 0) >= 2;
  const passHref = multiOpen
    ? '/program?type=MEMBERSHIP'
    : openMembershipId != null
      ? `/all-in-one-pass/${openMembershipId}`
      : null;

  return {
    hasPrivilege,
    showPassPrice,
    passHref,
    passPrices,
  };
};
