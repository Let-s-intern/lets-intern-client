import { useGetChallengeOptions } from '@/api/challengeOption';
import {
  ChallengeIdSchema,
  ChallengePricePlan,
  ChallengePricePlanEnum,
} from '@/schema';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

const { BASIC, STANDARD, PREMIUM } = ChallengePricePlanEnum.enum;

export default function useAdminChallengeOption(challenge?: ChallengeIdSchema) {
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
  const [standardInfo, setStandardInfo] = useState({
    title: '',
    description: '',
  });
  const [premiumInfo, setPremiumInfo] = useState({
    title: '',
    description: '',
  });

  /** 옵션 관련 함수*/
  const handleChangeInfo = useCallback(
    (
      pricePlan: ChallengePricePlan,
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (pricePlan === 'PREMIUM') {
        setPremiumInfo((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      } else {
        setStandardInfo((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      }
    },
    [],
  );

  const handleChangePricePlan = useCallback((value: ChallengePricePlan) => {
    pricePlan.current = value;
    if (value === PREMIUM) return;

    // 프리미엄 초기화
    setPremiumOptIds([]);
    setPremiumInfo({ title: '', description: '' });

    if (value === STANDARD) return;

    // 스탠다드 초기화
    setStandardOptIds([]);
    setStandardInfo({ title: '', description: '' });
  }, []);

  useEffect(() => {
    // 스탠다드 옵션 정보를 상태에 저장
    if (!standardPriceInfo) return;
    pricePlan.current = STANDARD;
    const initialStandardOptIds = standardPriceInfo.challengeOptionList.map(
      (item) => item.challengeOptionId,
    );
    setStandardOptIds(initialStandardOptIds);
    setStandardInfo({
      title: standardPriceInfo.title ?? '',
      description: standardPriceInfo.description ?? '',
    });

    // 프리미엄 옵션 정보를 상태에 저장
    if (!premiumPriceInfo) return;
    pricePlan.current = PREMIUM;
    const optIds = premiumPriceInfo.challengeOptionList.map(
      (item) => item.challengeOptionId,
    );
    setPremiumOptIds(
      optIds.filter((id) => !initialStandardOptIds.includes(id)),
    );
    setPremiumInfo({
      title: premiumPriceInfo.title ?? '',
      description: premiumPriceInfo.description ?? '',
    });
  }, [standardPriceInfo, premiumPriceInfo]);

  return {
    pricePlan,
    standardPriceInfo,
    premiumPriceInfo,
    data,
    standardOptIds,
    premiumOptIds,
    standardInfo,
    premiumInfo,
    handleChangeInfo,
    handleChangePricePlan,
    setStandardOptIds,
    setPremiumOptIds,
    setStandardInfo,
    setPremiumInfo,
  };
}
