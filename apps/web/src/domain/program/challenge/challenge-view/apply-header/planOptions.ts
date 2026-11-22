import type {
  ChallengeIdSchema,
  ChallengePriceInfo,
  ChallengePricePlan,
} from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';

export interface PlanOption {
  plan: ChallengePricePlan;
  title: string;
  regularPrice: number;
  discountPercentage: number;
  /** 할인 뒤 판매가 */
  sellingPrice: number;
  /** 올인원 패스 회원가. 패스 혜택이 없거나 라이트면 null */
  passPrice: number | null;
}

const PLAN_ORDER: ChallengePricePlan[] = [
  'LIGHT',
  'BASIC',
  'STANDARD',
  'PREMIUM',
];

const DEFAULT_TITLE: Record<ChallengePricePlan, string> = {
  LIGHT: '라이트 플랜',
  BASIC: '베이직 플랜',
  STANDARD: '스탠다드 플랜',
  PREMIUM: '프리미엄 플랜',
};

/**
 * 상세 상단·따라오는 패널의 플랜 선택지. 챌린지에 있는 플랜만, 라이트 → 프리미엄 순.
 * 금액은 결제 시트와 같은 getChallengeOptionPriceInfo 로 계산한다
 */
export const buildPlanOptions = (
  priceInfoList: ChallengePriceInfo[] | ChallengeIdSchema['priceInfo'],
  passPrices: Partial<Record<ChallengePricePlan, number>> | null,
): PlanOption[] => {
  const prices = getChallengeOptionPriceInfo(priceInfoList);
  const amounts: Record<ChallengePricePlan, [number, number]> = {
    LIGHT: [prices.lightRegularPrice, prices.lightDiscountAmount],
    BASIC: [prices.basicRegularPrice, prices.basicDiscountAmount],
    STANDARD: [prices.standardRegularPrice, prices.standardDiscountAmount],
    PREMIUM: [prices.premiumRegularPrice, prices.premiumDiscountAmount],
  };
  return PLAN_ORDER.flatMap((plan) => {
    // 옵션 도입 전 챌린지는 플랜 구분이 없어 첫 가격을 베이직으로 본다
    const info =
      priceInfoList.find((item) => item.challengePricePlanType === plan) ??
      (plan === 'BASIC' && !priceInfoList[0]?.challengePricePlanType
        ? priceInfoList[0]
        : undefined);
    if (!info) return [];
    const [regularPrice, discountAmount] = amounts[plan];
    return [
      {
        plan,
        title: info.title || DEFAULT_TITLE[plan],
        regularPrice,
        discountPercentage:
          regularPrice > 0
            ? Math.round((discountAmount / regularPrice) * 100)
            : 0,
        sellingPrice: regularPrice - discountAmount,
        passPrice: passPrices?.[plan] ?? null,
      },
    ];
  });
};
