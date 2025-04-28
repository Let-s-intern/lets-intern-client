import { useProgramApplicationQuery } from '@/api/application';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import {
  ChallengeIdPrimitive,
  ChallengePricePlan,
  ChallengePricePlanEnum,
} from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import BaseBottomSheet from '@components/ui/BaseBottomSheet';
import { RadioGroup } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import BaseButton from '../ui/button/BaseButton';
import { OptionFormRadioControlLabel } from '../ui/ControlLabel';
import OptionDropdown from '../ui/OptionDropdown';
import PriceView from '../ui/PriceView';

const { STANDARD, PREMIUM, BASIC } = ChallengePricePlanEnum.enum;

function PricePlanBottomSheet({
  challenge,
  challengeId,
  isOpen,
  onClose,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const basicPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === BASIC,
  );
  const standardPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === STANDARD,
  );
  const premiumPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === PREMIUM,
  );
  const defaultValue = premiumPriceInfo
    ? PREMIUM
    : standardPriceInfo
      ? STANDARD
      : BASIC;

  const [pricePlan, setPricePlan] = useState<ChallengePricePlan>(defaultValue);

  /** 플랜 별 모든 가격 정보
   * 베이직: 기본 챌린지 금액
   * 스탠다드: 베이직에 스탠다드 옵션 금액을 더함
   * 프리미엄: 베이직에 프리미엄 옵션 금액을 더함
   */
  const totalPriceInfo = useMemo(() => {
    const challengePriceInfo = challenge.priceInfo[0]; // [주의] 옵션 도입 전 챌린지는 challengePricePlanType이 null임

    // 베이직
    const basicRegularPrice = basicPriceInfo
      ? (basicPriceInfo?.price ?? 0) + (basicPriceInfo?.refund ?? 0)
      : (challengePriceInfo.price ?? 0) + (challengePriceInfo.refund ?? 0); // 정가 = 이용료 + 보증금
    const basicDiscountPrice = basicPriceInfo
      ? (basicPriceInfo?.discount ?? 0)
      : (challengePriceInfo.discount ?? 0);

    // 스탠다드
    const standardRegularPrice = standardPriceInfo
      ? (basicRegularPrice ?? 0) +
        standardPriceInfo.challengeOptionList.reduce(
          (acc, curr) => acc + (curr.price ?? 0),
          0,
        )
      : 0;
    const standardDiscountPrice = standardPriceInfo
      ? (basicDiscountPrice ?? 0) +
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
    const premiumDiscountPrice = premiumPriceInfo
      ? (basicDiscountPrice ?? 0) +
        premiumPriceInfo.challengeOptionList.reduce(
          (acc, curr) => acc + (curr.discountPrice ?? 0),
          0,
        )
      : 0;

    return {
      basicRegularPrice,
      basicDiscountPrice,
      standardRegularPrice,
      standardDiscountPrice,
      premiumRegularPrice,
      premiumDiscountPrice,
    };
  }, [challenge.priceInfo]);

  /* 최종 정가 & 할인 금액 */
  const finalPriceInfo = useMemo(() => {
    // 베이직 최종 금액
    if (pricePlan === BASIC) {
      return {
        regularPrice: totalPriceInfo.basicRegularPrice, // 정가
        discountPrice: totalPriceInfo.basicDiscountPrice,
      };
    }
    // 스탠다드 최종 금액
    if (pricePlan === STANDARD) {
      return {
        regularPrice: totalPriceInfo.standardRegularPrice, // 정가
        discountPrice: totalPriceInfo.standardDiscountPrice,
      };
    }
    // 프리미엄 최종 금액
    return {
      regularPrice: totalPriceInfo.premiumRegularPrice, // 정가
      discountPrice: totalPriceInfo.premiumDiscountPrice,
    };
  }, [pricePlan, totalPriceInfo]);

  // 챌린지 참여자 목록 조회
  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  const { setProgramApplicationForm } = useProgramStore();

  const handleApply = useCallback(() => {
    const payInfo = application ? getPayInfo(application, pricePlan) : null;

    if (!payInfo) {
      window.alert('정보를 불러오는 중입니다. 잠시만 기다려주세요.');
      return;
    }

    const progressType: 'none' | 'ALL' | 'ONLINE' | 'OFFLINE' = 'none';
    const userInfo: UserInfo = {
      name: application?.name ?? '',
      email: application?.email ?? '',
      phoneNumber: application?.phoneNumber ?? '',
      contactEmail: application?.contactEmail ?? '',
      question: '',
      initialized: true,
    };

    const priceId = application?.priceList?.find(
      (item) => item.challengePricePlanType === pricePlan,
    )?.priceId; // 가격 플랜에 맞는 priceId 넘기기
    const orderId = generateOrderId();
    const totalPrice = Math.max(
      finalPriceInfo.regularPrice - finalPriceInfo.discountPrice,
      0,
    );
    const isFree =
      payInfo.challengePriceType === 'FREE' ||
      payInfo.livePriceType === 'FREE' ||
      payInfo.price === 0 ||
      totalPrice === 0;

    setProgramApplicationForm({
      priceId,
      price: finalPriceInfo.regularPrice, // 정가
      discount: finalPriceInfo.discountPrice,
      couponId: '',
      couponPrice: 0,
      totalPrice, // 판매가
      contactEmail: userInfo.contactEmail,
      question: userInfo.question,
      email: userInfo.email,
      phone: userInfo.phoneNumber,
      name: userInfo.name,
      programTitle: challenge.title,
      programType: 'challenge',
      progressType,
      programId: Number(challengeId),
      programOrderId: orderId,
      isFree,
      deposit: challenge.priceInfo[0].refund ?? 0,
    });

    router.push(`/payment-input`);
  }, [
    pricePlan,
    application,
    challenge,
    challengeId,
    router,
    setProgramApplicationForm,
    finalPriceInfo,
  ]);

  return (
    <>
      <BaseBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        className="mx-auto max-w-[1000px]"
      >
        {/* 챌린지 플랜 */}
        <span className="required-star mb-4 mt-3 block text-xsmall14 font-semibold">
          챌린지 플랜 선택 (필수)
        </span>
        <OptionDropdown
          label={`${challenge.title} 플랜`}
          wrapperClassName="w-full"
        >
          <RadioGroup
            aria-labelledby="price-plan-group-label"
            defaultValue={defaultValue}
            onChange={(_, v) => setPricePlan(v as ChallengePricePlan)}
          >
            {premiumPriceInfo && (
              <OptionFormRadioControlLabel
                key={PREMIUM}
                label={premiumPriceInfo.title}
                value={PREMIUM}
                wrapperClassName="py-3 pl-2 pr-3 border-b border-neutral-80"
                right={
                  <PriceView
                    price={totalPriceInfo.premiumRegularPrice}
                    discount={totalPriceInfo.premiumDiscountPrice}
                  />
                }
              />
            )}
            {standardPriceInfo && (
              <OptionFormRadioControlLabel
                key={STANDARD}
                label={standardPriceInfo.title}
                value={STANDARD}
                wrapperClassName="py-3 pl-2 pr-3 border-b border-neutral-80"
                right={
                  <PriceView
                    price={totalPriceInfo.standardRegularPrice}
                    discount={totalPriceInfo.standardDiscountPrice}
                  />
                }
              />
            )}
            <OptionFormRadioControlLabel
              key={BASIC}
              label="베이직 플랜"
              value={BASIC}
              wrapperClassName="py-3 pl-2 pr-3"
              right={
                <PriceView
                  price={totalPriceInfo.basicRegularPrice}
                  discount={totalPriceInfo.basicDiscountPrice}
                />
              }
            />
          </RadioGroup>
        </OptionDropdown>

        {/* 총 결제 금액 */}
        <span className="mt-6 block text-xsmall14 font-semibold">
          총 결제 금액
        </span>
        <hr className="my-3" />
        <span className="block text-right text-small18 font-bold text-neutral-10">
          {(
            finalPriceInfo.regularPrice - finalPriceInfo.discountPrice
          ).toLocaleString()}
          원
        </span>

        {/* 버튼 */}
        <section className="mt-6 flex items-center gap-3">
          <BaseButton className="flex-1" variant="outlined" onClick={onClose}>
            이전 단계로
          </BaseButton>
          <BaseButton
            className="next_button_click flex-1"
            onClick={handleApply}
          >
            신청하기
          </BaseButton>
        </section>
      </BaseBottomSheet>
    </>
  );
}

export default PricePlanBottomSheet;
