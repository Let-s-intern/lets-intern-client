import { ChallengePriceInfo } from '@/schema';

interface ChallengeOptionPriceInfo {
  basicRegularPrice: number; // 베이직 플랜 정가 = 이용료 + 보증금
  basicDiscountAmount: number; // 베이직 플랜 할인 금액
  standardRegularPrice: number; // 스탠다드 플랜 정가 = 베이직 정가 + 스탠다드 옵션 정가 총액
  standardDiscountAmount: number; // 스탠다드 플랜 할인 금액 = 베이직 할인 + 스탠다드 옵션 할인 총액
  premiumRegularPrice: number; // 프리미엄 플랜 정가 = 베이직 정가 + 프리미엄 옵션 정가 총액
  premiumDiscountAmount: number; // 프리미엄 플랜 할인 금액 = 베이직 할인 + 프리미엄 옵션 할인 총액
}

/** 플랜 별 모든 가격 정보
 * @description
 * 베이직: 기본 챌린지 금액
 * 스탠다드: 베이직에 스탠다드 옵션 금액을 더함
 * 프리미엄: 베이직에 프리미엄 옵션 금액을 더함
 * @returns ChallengeOptionPriceInfo
 */

export default function getChallengeOptionPriceInfo(
  priceInfoList: ChallengePriceInfo[],
): ChallengeOptionPriceInfo {
  const basicPriceInfo =
    priceInfoList.find((info) => info.challengePricePlanType === 'BASIC') ??
    priceInfoList[0]; // [주의] 옵션 도입 전 챌린지는 challengePricePlanType이 null임
  const standardPriceInfo = priceInfoList.find(
    (info) => info.challengePricePlanType === 'STANDARD',
  );
  const premiumPriceInfo = priceInfoList.find(
    (info) => info.challengePricePlanType === 'PREMIUM',
  );

  // 베이직
  const basicRegularPrice =
    (basicPriceInfo.price ?? 0) + (basicPriceInfo.refund ?? 0); // 정가 = 이용료 + 보증금
  const basicDiscountAmount = basicPriceInfo?.discount ?? 0;

  // 스탠다드
  const standardRegularPrice = standardPriceInfo
    ? (basicRegularPrice ?? 0) +
      standardPriceInfo.challengeOptionList.reduce(
        (acc, curr) => acc + (curr.price ?? 0),
        0,
      )
    : 0;
  const standardDiscountAmount = standardPriceInfo
    ? (basicDiscountAmount ?? 0) +
      standardPriceInfo.challengeOptionList.reduce(
        (acc, curr) => acc + (curr.discountPrice ?? 0),
        0,
      )
    : 0;

  // 프리미엄
  const premiumRegularPrice = premiumPriceInfo
    ? (basicRegularPrice ?? 0) +
      premiumPriceInfo.challengeOptionList.reduce(
        (acc, curr) => acc + (curr.price ?? 0),
        0,
      )
    : 0;
  const premiumDiscountAmount = premiumPriceInfo
    ? (basicDiscountAmount ?? 0) +
      premiumPriceInfo.challengeOptionList.reduce(
        (acc, curr) => acc + (curr.discountPrice ?? 0),
        0,
      )
    : 0;

  return {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
  };
}
