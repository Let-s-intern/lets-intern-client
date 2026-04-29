import { useGetChallengeOptions } from '@/api/challenge/challengeOption';
import {
  ChallengeIdSchema,
  ChallengePricePlan,
  ChallengePricePlanEnum,
} from '@/schema';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

const { BASIC, STANDARD, PREMIUM, LIGHT } = ChallengePricePlanEnum.enum;

export interface LightInfo {
  price: number;
  discount: number;
  title: string;
  description: string;
}

export default function useAdminChallengeOption(challenge?: ChallengeIdSchema) {
  /** 가격 플랜 (BASIC/STANDARD/PREMIUM만, LIGHT는 체크박스로 별도) */
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
  const lightPriceInfo = challenge?.priceInfo.find(
    (item) => item.challengePricePlanType === LIGHT,
  );

  /** 옵션 관련 상태 */
  const { data } = useGetChallengeOptions();

  /** 라이트 플랜 (체크박스로 켜면 추가, 이용료/할인과 독립) */
  const [isLightEnabled, setIsLightEnabled] = useState(false);
  const [lightInfo, setLightInfo] = useState<LightInfo>({
    price: 0,
    discount: 0,
    title: '',
    description: '',
  });

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
    if (value === LIGHT) return;
    pricePlan.current = value;
    if (value === PREMIUM) return;

    setPremiumOptIds([]);
    setPremiumInfo({ title: '', description: '' });

    if (value === STANDARD) return;

    setStandardOptIds([]);
    setStandardInfo({ title: '', description: '' });
  }, []);

  const handleChangeLightInfo = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      setLightInfo((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    },
    [],
  );

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

    if (lightPriceInfo) {
      setIsLightEnabled(true);
      setLightInfo({
        price: lightPriceInfo.price ?? 0,
        discount: lightPriceInfo.discount ?? 0,
        title: lightPriceInfo.title ?? '',
        description: lightPriceInfo.description ?? '',
      });
    }
  }, [basicPriceInfo, standardPriceInfo, premiumPriceInfo, lightPriceInfo]);

  return {
    pricePlan,
    basicPriceInfo,
    standardPriceInfo,
    premiumPriceInfo,
    lightPriceInfo,
    data,
    basicOptIds,
    standardOptIds,
    premiumOptIds,
    basicInfo,
    standardInfo,
    premiumInfo,
    isLightEnabled,
    lightInfo,
    handleChangeInfo,
    handleChangePricePlan,
    handleChangeLightInfo,
    setBasicOptIds,
    setStandardOptIds,
    setPremiumOptIds,
    setBasicInfo,
    setStandardInfo,
    setPremiumInfo,
    setIsLightEnabled,
    setLightInfo,
  };
}
