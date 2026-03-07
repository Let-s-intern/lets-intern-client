import { useGetChallengeOptions } from '@/api/challenge/challengeOption';
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

  const basicPriceInfo = challenge?.priceInfo.find(
    (item) => item.challengePricePlanType === BASIC,
  );
  const standardPriceInfo = challenge?.priceInfo.find(
    (item) => item.challengePricePlanType === STANDARD,
  );
  const premiumPriceInfo = challenge?.priceInfo.find(
    (item) => item.challengePricePlanType === PREMIUM,
  );

  /** 옵션 관련 상태 */
  const { data } = useGetChallengeOptions();

  const [basicOptIds, setBasicOptIds] = useState<number[]>([]);
  const [standardOptIds, setStandardOptIds] = useState<number[]>([]);
  const [premiumOptIds, setPremiumOptIds] = useState<number[]>([]);
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    description: '',
  });
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
      if (pricePlan === 'BASIC') {
        setBasicInfo((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      } else if (pricePlan === 'PREMIUM') {
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

    setPremiumOptIds([]);
    setPremiumInfo({ title: '', description: '' });

    if (value === STANDARD) return;

    setStandardOptIds([]);
    setStandardInfo({ title: '', description: '' });
  }, []);

  useEffect(() => {
    if (basicPriceInfo) {
      setBasicOptIds(
        basicPriceInfo.challengeOptionList?.map(
          (item) => item.challengeOptionId,
        ) ?? [],
      );
      setBasicInfo({
        title: basicPriceInfo.title ?? '',
        description: basicPriceInfo.description ?? '',
      });
    }

    if (standardPriceInfo) {
      pricePlan.current = STANDARD;
      const initialStandardOptIds = standardPriceInfo.challengeOptionList.map(
        (item) => item.challengeOptionId,
      );
      setStandardOptIds(initialStandardOptIds);
      setStandardInfo({
        title: standardPriceInfo.title ?? '',
        description: standardPriceInfo.description ?? '',
      });
    }

    if (premiumPriceInfo) {
      pricePlan.current = PREMIUM;
      const initialStandardOptIds =
        standardPriceInfo?.challengeOptionList.map(
          (item) => item.challengeOptionId,
        ) ?? [];
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
    }
  }, [basicPriceInfo, standardPriceInfo, premiumPriceInfo]);

  return {
    pricePlan,
    basicPriceInfo,
    standardPriceInfo,
    premiumPriceInfo,
    data,
    basicOptIds,
    standardOptIds,
    premiumOptIds,
    basicInfo,
    standardInfo,
    premiumInfo,
    handleChangeInfo,
    handleChangePricePlan,
    setBasicOptIds,
    setStandardOptIds,
    setPremiumOptIds,
    setBasicInfo,
    setStandardInfo,
    setPremiumInfo,
  };
}
