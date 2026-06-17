import { ChallengeIdSchema, ChallengePriceInfo } from '@/schema';

interface ChallengeOptionPriceInfo {
  basicRegularPrice: number; // 베이직 플랜 정가 = 이용료 + 보증금
  basicDiscountAmount: number; // 베이직 플랜 할인 금액
  standardRegularPrice: number; // 스탠다드 플랜 정가 = 베이직 정가 + 스탠다드 옵션 정가 총액
  standardDiscountAmount: number; // 스탠다드 플랜 할인 금액 = 베이직 할인 + 스탠다드 옵션 할인 총액
  premiumRegularPrice: number; // 프리미엄 플랜 정가 = 베이직 정가 + 프리미엄 옵션 정가 총액
  premiumDiscountAmount: number; // 프리미엄 플랜 할인 금액 = 베이직 할인 + 프리미엄 옵션 할인 총액
  lightRegularPrice: number; // 라이트 플랜 정가 (이용료/할인과 독립)
  lightDiscountAmount: number; // 라이트 플랜 할인 금액 (이용료/할인과 독립)
}

/** 플랜 별 모든 가격 정보
 * @description
 * 베이직: 이용료 + 보증금 + 베이직 옵션 금액
 * 스탠다드: 베이직 + 스탠다드 옵션 금액
 * 프리미엄: 베이직 + 프리미엄 옵션
 * @returns ChallengeOptionPriceInfo
 */

export default function getChallengeOptionPriceInfo(
  priceInfoList: ChallengePriceInfo[] | ChallengeIdSchema['priceInfo'],
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
  const lightPriceInfo = priceInfoList.find(
    (info) => info.challengePricePlanType === 'LIGHT',
  );

  const basicOptionList = basicPriceInfo.challengeOptionList ?? [];

  // 베이직: 기본(이용료+보증금) + 베이직 옵션 정가/할인
  const basicRegularPrice =
    (basicPriceInfo.price ?? 0) +
    (basicPriceInfo.refund ?? 0) +
    basicOptionList.reduce((acc, curr) => acc + (curr.price ?? 0), 0);
  const basicDiscountAmount =
    (basicPriceInfo?.discount ?? 0) +
    basicOptionList.reduce((acc, curr) => acc + (curr.discountPrice ?? 0), 0);

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

  const lightRegularPrice = lightPriceInfo ? (lightPriceInfo.price ?? 0) : 0;
  const lightDiscountAmount = lightPriceInfo
    ? (lightPriceInfo.discount ?? 0)
    : 0;

  return {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
    lightRegularPrice,
    lightDiscountAmount,
  };
}
