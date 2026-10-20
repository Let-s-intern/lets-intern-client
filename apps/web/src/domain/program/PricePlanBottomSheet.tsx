import { useProgramApplicationQuery } from '@/api/application';
import BaseBottomSheet from '@/common/sheet/BaseBottomSheet';
import FeedbackMentoringLink from '@/domain/program/challenge/ui/FeedbackMentoringLink';
import {
  MembershipBenefitNotice,
  PlanPriceRight,
} from '@/domain/program/challenge/ui/PricePlanMembership';
import { useChallengePassBenefit } from '@/domain/program/challenge/useChallengePassBenefit';
import { getChallengeThemeColor } from '@/domain/program/challenge/utils/getChallengeThemeColor';
import { COUPON_DISABLED_CHALLENGE_TYPES } from '@/domain/program/program-detail/apply/constants';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import { twMerge } from '@/lib/twMerge';
import {
  ChallengeIdPrimitive,
  ChallengePricePlan,
  ChallengePricePlanEnum,
} from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { RadioGroup } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComponentProps, useCallback, useMemo, useState } from 'react';
import BaseButton from '../../common/button/BaseButton';
import { OptionFormRadioControlLabel } from '../../common/ControlLabel';
import OptionDropdown from '../../common/dropdown/OptionDropdown';

const { STANDARD, PREMIUM, BASIC, LIGHT } = ChallengePricePlanEnum.enum;

/**
 * 플랜 옵션 카드 — 라디오+플랜명+가격이 한 행, 설명은 아래 bg-neutral-100 박스.
 * 모바일에선 가격이 설명 아래로 내려가고 가격 블록도 세로로 쌓임.
 */
function PlanOption({
  value,
  title,
  description,
  isLast,
  priceProps,
}: {
  value: ChallengePricePlan;
  title: string;
  description: string;
  isLast?: boolean;
  priceProps: ComponentProps<typeof PlanPriceRight>;
}) {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-1 py-3 pl-2 pr-3 md:gap-2',
        !isLast && 'border-neutral-80 border-b',
      )}
    >
      <OptionFormRadioControlLabel
        value={value}
        label={<b className="font-medium">{title}</b>}
        right={
          <div className="hidden md:block">
            <PlanPriceRight {...priceProps} />
          </div>
        }
      />
      {description && (
        <p className="rounded-xs text-xsmall14 text-neutral-10 bg-neutral-100 px-4 py-2 font-normal">
          {description}
        </p>
      )}
      <div className="flex justify-end md:hidden">
        <PlanPriceRight {...priceProps} />
      </div>
    </div>
  );
}

function PricePlanBottomSheet({
  challenge,
  challengeId,
  isOpen,
  onClose,
  showMembershipBenefit = false,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
  isOpen: boolean;
  onClose: () => void;
  // 올인원패스 혜택(패스회원가/업셀) 노출 — 챌린지 상세에서만 true. 멤버십 랜딩 등은 false.
  showMembershipBenefit?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * B2B 파라미터 전달 여부 결정
   * @note 챌린지 타입이 CAREER_START 또는 EXPERIENCE_SUMMARY인 경우에만 source=b2b 파라미터를 전달
   *       - 해당 타입들은 B2B 전용으로, 쿠폰 노출 여부를 결정하기 위해 파라미터 필요
   *       - 유저가 URL에 임의로 source=b2b를 붙여도 챌린지 타입이 맞지 않으면 무시됨
   */
  const isCouponDisabledType = COUPON_DISABLED_CHALLENGE_TYPES.includes(
    challenge.challengeType,
  );
  const hasB2BParam = searchParams.get('source') === 'b2b';
  const shouldPassB2BParam = isCouponDisabledType && hasB2BParam;

  const basicPriceInfo =
    challenge.priceInfo.find((item) => item.challengePricePlanType === BASIC) ??
    challenge.priceInfo[0];
  const standardPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === STANDARD,
  );
  const premiumPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === PREMIUM,
  );
  const lightPriceInfo = challenge.priceInfo.find(
    (item) => item.challengePricePlanType === LIGHT,
  );
  const defaultValue = lightPriceInfo
    ? LIGHT
    : premiumPriceInfo
      ? PREMIUM
      : standardPriceInfo
        ? STANDARD
        : BASIC;

  const [pricePlan, setPricePlan] = useState<ChallengePricePlan>(defaultValue);

  const {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
    lightRegularPrice,
    lightDiscountAmount,
  } = getChallengeOptionPriceInfo(challenge.priceInfo);

  /* 최종 정가 & 할인 금액 */
  const finalPriceInfo = useMemo(() => {
    // 라이트 최종 금액
    if (pricePlan === LIGHT) {
      return {
        regularPrice: lightRegularPrice,
        discountPrice: lightDiscountAmount,
      };
    }
    // 베이직 최종 금액
    if (pricePlan === BASIC) {
      return {
        regularPrice: basicRegularPrice, // 정가
        discountPrice: basicDiscountAmount,
      };
    }
    // 스탠다드 최종 금액
    if (pricePlan === STANDARD) {
      return {
        regularPrice: standardRegularPrice, // 정가
        discountPrice: standardDiscountAmount,
      };
    }
    // 프리미엄 최종 금액
    return {
      regularPrice: premiumRegularPrice, // 정가
      discountPrice: premiumDiscountAmount,
    };
  }, [
    pricePlan,
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
    lightRegularPrice,
    lightDiscountAmount,
  ]);

  // 올인원패스 혜택 — showMembershipBenefit=true인 챌린지 상세에서만 활성
  const { hasPrivilege, showPassPrice, openMembershipId, passPrices } =
    useChallengePassBenefit({
      challengeId,
      enabled: showMembershipBenefit,
      prices: {
        basicRegularPrice,
        basicDiscountAmount,
        standardRegularPrice,
        standardDiscountAmount,
        premiumRegularPrice,
        premiumDiscountAmount,
      },
    });
  const selectedPassPrice =
    pricePlan === BASIC
      ? passPrices.BASIC
      : pricePlan === STANDARD
        ? passPrices.STANDARD
        : pricePlan === PREMIUM
          ? passPrices.PREMIUM
          : undefined; // LIGHT 제외

  const normalTotal = Math.max(
    finalPriceInfo.regularPrice - finalPriceInfo.discountPrice,
    0,
  );
  const displayTotal =
    hasPrivilege && selectedPassPrice !== undefined
      ? selectedPassPrice
      : normalTotal;

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
    const totalPrice = displayTotal; // 권한 보유 시 패스회원가, 아니면 판매가
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
      totalPrice, // 판매가(권한 시 패스회원가)
      membershipDiscount: hasPrivilege
        ? Math.max(normalTotal - displayTotal, 0)
        : 0,
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
      deposit: hasPrivilege ? 0 : (challenge.priceInfo[0].refund ?? 0),
    });

    router.push(
      shouldPassB2BParam ? '/payment-input?source=b2b' : '/payment-input',
    );
  }, [
    application,
    pricePlan,
    finalPriceInfo.regularPrice,
    finalPriceInfo.discountPrice,
    displayTotal,
    normalTotal,
    hasPrivilege,
    setProgramApplicationForm,
    challenge.title,
    challenge.priceInfo,
    challengeId,
    router,
    shouldPassB2BParam,
  ]);

  return (
    <>
      <BaseBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        className="mx-auto max-w-[1000px]"
      >
        {/* 챌린지 플랜 */}
        <div className="mb-4 mt-3 flex items-center justify-between">
          <span className="required-star text-xsmall14 font-semibold">
            챌린지 플랜 선택 (필수)
          </span>
          <FeedbackMentoringLink
            challengeType={challenge.challengeType}
            themeColor={getChallengeThemeColor(challenge.challengeType)}
            className="text-xxsmall12 px-2.5 py-1"
          />
        </div>
        <OptionDropdown
          label={`${challenge.title} 플랜`}
          wrapperClassName="flex max-h-[312px] w-full flex-col md:max-h-none"
        >
          {/* 헤더는 OptionDropdown이 고정, 플랜 많아지면 이 영역만 스크롤(모바일 312px 상한) */}
          <div className="min-h-0 overflow-y-auto md:overflow-visible">
            <RadioGroup
              aria-labelledby="price-plan-group-label"
              value={pricePlan}
              onChange={(_, v) => setPricePlan(v as ChallengePricePlan)}
            >
              {lightPriceInfo && (
                <PlanOption
                  key={LIGHT}
                  value={LIGHT}
                  title={lightPriceInfo.title || '라이트 플랜'}
                  description={lightPriceInfo.description ?? ''}
                  priceProps={{
                    regularPrice: lightRegularPrice,
                    discountAmount: lightDiscountAmount,
                    hasPrivilege,
                    showPassPrice,
                  }}
                />
              )}
              {premiumPriceInfo && (
                <PlanOption
                  key={PREMIUM}
                  value={PREMIUM}
                  title={premiumPriceInfo.title || '프리미엄 플랜'}
                  description={premiumPriceInfo.description ?? ''}
                  priceProps={{
                    regularPrice: premiumRegularPrice,
                    discountAmount: premiumDiscountAmount,
                    passPrice: passPrices.PREMIUM,
                    hasPrivilege,
                    showPassPrice,
                  }}
                />
              )}
              {standardPriceInfo && (
                <PlanOption
                  key={STANDARD}
                  value={STANDARD}
                  title={standardPriceInfo.title || '스탠다드 플랜'}
                  description={standardPriceInfo.description ?? ''}
                  priceProps={{
                    regularPrice: standardRegularPrice,
                    discountAmount: standardDiscountAmount,
                    passPrice: passPrices.STANDARD,
                    hasPrivilege,
                    showPassPrice,
                  }}
                />
              )}
              <PlanOption
                key={BASIC}
                value={BASIC}
                title={basicPriceInfo.title || '베이직 플랜'}
                description={basicPriceInfo.description ?? ''}
                isLast
                priceProps={{
                  regularPrice: basicRegularPrice,
                  discountAmount: basicDiscountAmount,
                  passPrice: passPrices.BASIC,
                  hasPrivilege,
                  showPassPrice,
                }}
              />
            </RadioGroup>
          </div>
        </OptionDropdown>

        <MembershipBenefitNotice
          show={showPassPrice}
          hasPrivilege={hasPrivilege}
          openMembershipId={openMembershipId}
        />

        {/* 총 결제 금액 */}
        <span className="text-xsmall14 mt-5 block font-semibold md:mt-6">
          총 결제 금액
        </span>
        <hr className="my-3" />
        <span className="text-small18 text-neutral-10 block text-right font-bold">
          {displayTotal.toLocaleString()}원
        </span>

        {/* 버튼 */}
        <section className="mt-5 flex items-center gap-3 md:mt-6">
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
