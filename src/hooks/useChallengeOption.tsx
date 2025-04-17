import { useGetChallengeOptions } from '@/api/challengeOption';
import {
  ChallengeIdSchema,
  ChallengePricePlan,
  ChallengePricePlanEnum,
} from '@/schema';
import { useCallback, useRef, useState } from 'react';

const { BASIC, STANDARD, PREMIUM } = ChallengePricePlanEnum.enum;

export default function useChallengeOption(challenge?: ChallengeIdSchema) {
  /** 가격 플랜 */

  const pricePlan = useRef<ChallengePricePlan>(BASIC);

  const standardPriceInfo = challenge?.priceInfo.find(
    (item) => item.challengePricePlanType === STANDARD,
  );
  const premiumPriceInfo = challenge?.priceInfo.find(
    (item) => item.challengePricePlanType === PREMIUM,
  );

  /** 옵션 관련 상태 */
  const { data } = useGetChallengeOptions();

  const [standardOptIds, setStandardOptIds] = useState<number[]>([]);
  const [premiumOptIds, setPremiumOptIds] = useState<number[]>([]);
  const [pricePlanTitles, setPricePlanTitles] = useState({
    standard: '',
    premium: '',
  });

  /** 옵션 관련 함수*/
  const handleChangePricePlanTitle = useCallback(
    (pricePlan: ChallengePricePlan, value: string) => {
      setPricePlanTitles((prev) => ({
        ...prev,
        [pricePlan === 'PREMIUM' ? 'premium' : 'standard']: value,
      }));
    },
    [],
  );

  const handleChangePricePlan = useCallback((value: ChallengePricePlan) => {
    pricePlan.current = value;
    if (value === PREMIUM) return;

    // 프리미엄 초기화
    setPremiumOptIds([]);
    setPricePlanTitles((prev) => ({ ...prev, premium: '' }));

    if (value === STANDARD) return;

    // 스탠다드 초기화
    setStandardOptIds([]);
    setPricePlanTitles((prev) => ({ ...prev, standard: '' }));
  }, []);

  return {
    pricePlan,
    standardPriceInfo,
    premiumPriceInfo,
    data,
    standardOptIds,
    premiumOptIds,
    pricePlanTitles,
    handleChangePricePlanTitle,
    handleChangePricePlan,
    setStandardOptIds,
    setPremiumOptIds,
    setPricePlanTitles,
  };
}
