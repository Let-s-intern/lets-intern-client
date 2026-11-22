'use client';

import { useGetMembershipPrivilege } from '@/domain/all-in-one-pass/api/privilege';
import {
  ChallengeIdSchema,
  ChallengePriceInfo,
  ChallengePricePlan,
} from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { useParams } from 'next/navigation';

/**
 * 선택한 플랜의 정가·할인·환급·최종 금액.
 * 올인원패스 권한 보유 시 패스회원가 = max(플랜 판매가 − BASIC 판매가, 0) (LIGHT 는 0원),
 * useChallengePassBenefit 와 같은 규칙이다. 서버는 패스 권한이 있으면 플랜과 관계없이 0원으로 계산한다.
 */
export const useChallengePlanPrice = (
  priceInfoList: ChallengePriceInfo[] | ChallengeIdSchema['priceInfo'],
  plan: ChallengePricePlan,
) => {
  const basicPriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'BASIC',
  );

  const deposit = plan === 'LIGHT' ? 0 : (basicPriceInfo?.refund ?? 0); // 환급 (보증금) 라이트는 보증금 없음

  const {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
    lightRegularPrice,
    lightDiscountAmount,
  } = getChallengeOptionPriceInfo(priceInfoList);

  const [regularPrice, discountAmount] =
    plan === 'LIGHT'
      ? [lightRegularPrice, lightDiscountAmount]
      : plan === 'STANDARD'
        ? [standardRegularPrice, standardDiscountAmount]
        : plan === 'PREMIUM'
          ? [premiumRegularPrice, premiumDiscountAmount]
          : [basicRegularPrice, basicDiscountAmount];
  const sellingPrice = regularPrice - discountAmount;

  const discountPercentage = Math.round((discountAmount / regularPrice) * 100);
  const finalPrice = sellingPrice - deposit; // 최종 금액 (환급 금액 미포함)

  const params = useParams();
  const challengeId = typeof params?.id === 'string' ? params.id : '';
  const { data: privilege } = useGetMembershipPrivilege(
    'CHALLENGE',
    challengeId ? Number(challengeId) : -1,
  );
  const hasPrivilege = !!challengeId && (privilege?.hasPrivilege ?? false);
  const basicSellingPrice = Math.max(
    basicRegularPrice - basicDiscountAmount,
    0,
  );
  const activePassPrice =
    plan === 'LIGHT' ? 0 : Math.max(sellingPrice - basicSellingPrice, 0);
  const isPassApplied = hasPrivilege && activePassPrice !== undefined;
  const passFinalPrice = activePassPrice ?? sellingPrice;
  const membershipDiscount = isPassApplied
    ? Math.max(sellingPrice - passFinalPrice, 0)
    : 0;
  const showDeposit = deposit !== 0 && !isPassApplied; // 권한 시 보증금 면제 → 환급 숨김

  return {
    regularPrice,
    discountAmount,
    discountPercentage,
    sellingPrice,
    deposit,
    showDeposit,
    isPassApplied,
    membershipDiscount,
    /** 패스회원가 (LIGHT 는 0원) */
    passFinalPrice,
    /** 화면에 보여줄 최종 결제 금액 */
    finalPrice: isPassApplied ? passFinalPrice : finalPrice,
    /** 실제로 결제하는 금액 (환급은 나중에 돌려받으므로 빼지 않는다) */
    paymentPrice: isPassApplied ? passFinalPrice : sellingPrice,
    /** 할부 표시 기준 판매가 */
    displaySellingPrice: isPassApplied ? passFinalPrice : sellingPrice,
  };
};
