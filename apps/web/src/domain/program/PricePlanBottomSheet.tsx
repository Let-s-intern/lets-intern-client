import { useProgramApplicationQuery } from '@/api/application';
import BaseBottomSheet from '@/common/sheet/BaseBottomSheet';
import { COUPON_DISABLED_CHALLENGE_TYPES } from '@/domain/program/program-detail/apply/constants';
import {
  calculateChallengeTotalWithVodPass,
  calculateVodPassDurationDays,
  calculateVodPassPrice,
  clampVodPassMonths,
  getVodPassMaxMonths,
  isVodPassPurchasable,
  supportsVodPassMonths,
  VOD_PASS_MIN_MONTHS,
} from '@/domain/program/vodPassPurchase';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import { twMerge } from '@/lib/twMerge';
import {
  ChallengeIdPrimitive,
  ChallengePricePlan,
  ChallengePricePlanEnum,
} from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import FeedbackMentoringLink from '@/domain/program/challenge/ui/FeedbackMentoringLink';
import { getChallengeThemeColor } from '@/domain/program/challenge/utils/getChallengeThemeColor';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { Checkbox, FormControlLabel, RadioGroup } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import BaseButton from '../../common/button/BaseButton';
import { OptionFormRadioControlLabel } from '../../common/ControlLabel';
import OptionDropdown from '../../common/dropdown/OptionDropdown';
import PriceView from '../../common/price/PriceView';

const { STANDARD, PREMIUM, BASIC, LIGHT } = ChallengePricePlanEnum.enum;

function PricePlanLabel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <>
      <b className="font-bold">{title}</b>
      <br />
      <span className="text-neutral-10">{description}</span>
    </>
  );
}

// 체크박스 색은 common/ControlLabel.tsx 와 같은 파란색을 쓰되, 해제 상태 테두리만 진하게 한다.
// 공용 색(#E7E7E7)은 흰 배경에서 거의 보이지 않는다.
const VOD_PASS_CHECKBOX_SX = {
  color: '#ACAFB6',
  '&.Mui-checked': {
    color: '#5177FF',
  },
};

const VOD_PASS_LABEL_SX = {
  m: 0,
  width: '100%',
  '.MuiFormControlLabel-label': {
    flex: 1,
    minWidth: 0,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#2A2D34',
    fontFamily: 'Pretendard Variable',
  },
};

function VodPassLabel({
  title,
  durationDays,
  price,
  checked,
}: {
  title: string;
  durationDays: number;
  price: number;
  checked: boolean;
}) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <b className="font-bold">{title}</b>
          <span
            className={twMerge(
              'text-xxsmall12 text-primary rounded-full px-2 py-0.5 font-medium',
              checked ? 'bg-static-100' : 'bg-primary-10',
            )}
          >
            {durationDays}일 이용권
          </span>
        </span>
        <span className="text-xxsmall12 text-neutral-30 mt-1 block font-normal leading-5">
          결제 즉시 이용이 시작됩니다. 이용 중인 이용권이 있으면 종료 후 이어서
          시작됩니다
        </span>
      </span>
      <span
        className={twMerge(
          'text-xsmall14 flex shrink-0 items-baseline font-bold',
          checked ? 'text-primary' : 'text-neutral-10',
        )}
      >
        <span aria-hidden="true">+</span>
        <span>{price.toLocaleString()}원</span>
      </span>
    </span>
  );
}

const VOD_PASS_STEPPER_BUTTON_CLASS =
  'border-neutral-80 text-neutral-10 disabled:text-neutral-60 flex h-8 w-8 items-center justify-center rounded-xs border bg-white text-base font-bold disabled:cursor-not-allowed';

function VodPassMonthsStepper({
  months,
  maxMonths,
  additionalMonthPrice,
  onChange,
}: {
  months: number;
  maxMonths: number;
  additionalMonthPrice: number;
  onChange: (months: number) => void;
}) {
  return (
    <div className="border-primary-20 flex items-center justify-between gap-3 border-t px-3 py-3">
      <span className="min-w-0">
        <span className="text-xsmall14 block font-medium">이용 기간</span>
        {additionalMonthPrice > 0 && (
          <span className="text-xxsmall12 text-neutral-30 mt-0.5 block">
            2개월부터 매월 +{additionalMonthPrice.toLocaleString()}원
          </span>
        )}
        <span className="text-xxsmall12 text-neutral-30 mt-0.5 block">
          최대 {maxMonths}개월까지 선택할 수 있어요
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="이용 개월 수 줄이기"
          className={VOD_PASS_STEPPER_BUTTON_CLASS}
          disabled={months <= VOD_PASS_MIN_MONTHS}
          onClick={() => onChange(months - 1)}
        >
          -
        </button>
        <span
          className="text-xsmall14 min-w-[3.5rem] text-center font-semibold"
          aria-live="polite"
        >
          {months}개월
        </span>
        <button
          type="button"
          aria-label="이용 개월 수 늘리기"
          className={VOD_PASS_STEPPER_BUTTON_CLASS}
          disabled={months >= maxMonths}
          onClick={() => onChange(months + 1)}
        >
          +
        </button>
      </span>
    </div>
  );
}

function PricePlanBottomSheet({
  challenge,
  challengeId,
  challengeVersionId = null,
  isOpen,
  onClose,
}: {
  challenge: ChallengeIdPrimitive;
  challengeId: string;
  /** 들어온 상세 페이지의 버전. 버전 없는 챌린지면 null (LC-3247) */
  challengeVersionId?: number | null;
  isOpen: boolean;
  onClose: () => void;
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
  // VOD 이용권 선택 여부와 개월 수. 플랜과 독립이라 플랜을 바꿔도 유지한다 (LC-3438)
  const [isVodPassChecked, setIsVodPassChecked] = useState(false);
  const [vodPassMonths, setVodPassMonths] = useState(VOD_PASS_MIN_MONTHS);

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

  // 챌린지 참여자 목록 조회
  const { data: application } = useProgramApplicationQuery(
    'challenge',
    Number(challengeId),
  );

  const { setProgramApplicationForm } = useProgramStore();

  // 서버는 어드민에서 VOD 이용권 판매를 켠 프로그램에만 상품을 내려준다 (LC-3438)
  // 상품이 null·누락(판매 꺼짐, 상품 비활성, 서버 배포 전)이면 카드도 선택값도 없다
  // 보유 기간이 누적 상한에 차서 더 살 수 없는 사용자에게는 카드를 보여주지 않는다
  const offeredVodPassProduct = application?.vodPassProduct ?? null;
  const vodPassProduct =
    offeredVodPassProduct && isVodPassPurchasable(offeredVodPassProduct)
      ? offeredVodPassProduct
      : null;
  const vodPassMaxMonths = vodPassProduct
    ? getVodPassMaxMonths(vodPassProduct)
    : VOD_PASS_MIN_MONTHS;
  const selectedVodPass = isVodPassChecked ? vodPassProduct : null;
  // 추가 월 가격이 없는 응답이면 개월 선택을 지원하지 않는 서버라 1개월로 고정한다
  const canSelectMonths = vodPassProduct
    ? supportsVodPassMonths(vodPassProduct)
    : false;
  const selectedMonths = canSelectMonths
    ? clampVodPassMonths(vodPassMonths, vodPassMaxMonths)
    : VOD_PASS_MIN_MONTHS;
  const vodPassPrice = selectedVodPass
    ? calculateVodPassPrice(selectedVodPass, selectedMonths)
    : 0;
  const vodPassDurationDays = selectedVodPass
    ? calculateVodPassDurationDays(selectedVodPass, selectedMonths)
    : 0;

  // 화면 합계와 스토어에 담는 totalPrice 는 같은 함수에서 나온다. 쿠폰은 결제 입력 단계에서 적용된다
  const totalPrice = calculateChallengeTotalWithVodPass({
    regularPrice: finalPriceInfo.regularPrice,
    discount: finalPriceInfo.discountPrice,
    couponPrice: 0,
    vodPassPrice,
  });

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
    // 이용권을 담으면 서버가 paymentKey 를 요구하므로 무료 신청으로 처리하지 않는다
    const isFree =
      !selectedVodPass &&
      (payInfo.challengePriceType === 'FREE' ||
        payInfo.livePriceType === 'FREE' ||
        // 가격 행의 이용료(payInfo.price)는 옵션 금액을 모른다. 이용료 0원 + 유료 옵션 플랜이
        // 무료로 처리돼 결제창 없이 신청이 넘어가고 서버 결제 승인이 실패했다. 옵션까지 더한 금액으로 본다
        totalPrice === 0);

    setProgramApplicationForm({
      priceId,
      price: finalPriceInfo.regularPrice, // 정가
      discount: finalPriceInfo.discountPrice,
      couponId: '',
      couponPrice: 0,
      totalPrice, // 판매가. 이용권을 담았다면 쿠폰 적용 뒤에 더해질 이용권 가격이 포함돼 있다
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
      // 버전은 들어온 페이지의 버전으로 고정한다. 다른 챌린지·버전에서 남은 값을
      // 항상 덮어쓰고, LIGHT 는 버전을 쓰지 않는다 (설계안 D1)
      challengeVersionId: pricePlan === LIGHT ? null : challengeVersionId,
      // 미선택이면 0 으로 되돌려 이전 선택이 남지 않게 한다
      vodPassProductId: selectedVodPass?.id ?? 0,
      vodPassPrice, // 선택한 개월 수 기준 총액
      vodPassDurationDays, // 선택한 개월 수 기준 총 이용일수
      vodPassMonths: selectedVodPass ? selectedMonths : 0,
    });

    router.push(
      shouldPassB2BParam ? '/payment-input?source=b2b' : '/payment-input',
    );
  }, [
    application,
    pricePlan,
    challengeVersionId,
    finalPriceInfo.regularPrice,
    finalPriceInfo.discountPrice,
    selectedVodPass,
    selectedMonths,
    totalPrice,
    vodPassPrice,
    vodPassDurationDays,
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
        <div className="mb-4 mt-6 flex items-center justify-between">
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
          wrapperClassName="w-full"
        >
          <RadioGroup
            aria-labelledby="price-plan-group-label"
            value={pricePlan}
            onChange={(_, v) => setPricePlan(v as ChallengePricePlan)}
          >
            {lightPriceInfo && (
              <OptionFormRadioControlLabel
                key={LIGHT}
                label={
                  <PricePlanLabel
                    title={lightPriceInfo.title || '라이트 플랜'}
                    description={lightPriceInfo.description ?? ''}
                  />
                }
                value={LIGHT}
                wrapperClassName="py-3 pl-2 pr-3 border-b border-neutral-80"
                right={
                  <PriceView
                    price={lightRegularPrice}
                    discount={lightDiscountAmount}
                  />
                }
              />
            )}
            {premiumPriceInfo && (
              <OptionFormRadioControlLabel
                key={PREMIUM}
                label={
                  <PricePlanLabel
                    title={premiumPriceInfo.title || '프리미엄 플랜'}
                    description={premiumPriceInfo.description ?? ''}
                  />
                }
                value={PREMIUM}
                wrapperClassName="py-3 pl-2 pr-3 border-b border-neutral-80"
                right={
                  <PriceView
                    price={premiumRegularPrice}
                    discount={premiumDiscountAmount}
                  />
                }
              />
            )}
            {standardPriceInfo && (
              <OptionFormRadioControlLabel
                key={STANDARD}
                label={
                  <PricePlanLabel
                    title={standardPriceInfo.title || '스탠다드 플랜'}
                    description={standardPriceInfo.description ?? ''}
                  />
                }
                value={STANDARD}
                wrapperClassName="py-3 pl-2 pr-3 border-b border-neutral-80"
                right={
                  <PriceView
                    price={standardRegularPrice}
                    discount={standardDiscountAmount}
                  />
                }
              />
            )}
            <OptionFormRadioControlLabel
              key={BASIC}
              label={
                <PricePlanLabel
                  title={basicPriceInfo.title || '베이직 플랜'}
                  description={basicPriceInfo.description ?? ''}
                />
              }
              value={BASIC}
              wrapperClassName="py-3 pl-2 pr-3"
              right={
                <PriceView
                  price={basicRegularPrice}
                  discount={basicDiscountAmount}
                />
              }
            />
          </RadioGroup>
        </OptionDropdown>

        {/* VOD 이용권 (플랜과 독립) */}
        {vodPassProduct && (
          <>
            <span className="text-xsmall14 mb-3 mt-6 block font-semibold">
              VOD 이용권 추가 (선택)
            </span>
            <div
              className={twMerge(
                'rounded-xs overflow-hidden border transition-colors',
                isVodPassChecked
                  ? 'border-primary bg-primary-5'
                  : 'border-neutral-80 hover:bg-neutral-100',
              )}
            >
              <FormControlLabel
                className="py-3 pl-2 pr-3"
                sx={VOD_PASS_LABEL_SX}
                checked={isVodPassChecked}
                onChange={(_, checked) => setIsVodPassChecked(checked)}
                control={<Checkbox size="small" sx={VOD_PASS_CHECKBOX_SX} />}
                label={
                  <VodPassLabel
                    title={vodPassProduct.title}
                    durationDays={calculateVodPassDurationDays(
                      vodPassProduct,
                      selectedMonths,
                    )}
                    price={calculateVodPassPrice(
                      vodPassProduct,
                      selectedMonths,
                    )}
                    checked={isVodPassChecked}
                  />
                }
              />
              {isVodPassChecked && canSelectMonths && (
                <VodPassMonthsStepper
                  months={selectedMonths}
                  maxMonths={vodPassMaxMonths}
                  additionalMonthPrice={
                    vodPassProduct.additionalMonthPrice ?? 0
                  }
                  onChange={(months) =>
                    setVodPassMonths(
                      clampVodPassMonths(months, vodPassMaxMonths),
                    )
                  }
                />
              )}
            </div>
          </>
        )}

        {/* 총 결제 금액 */}
        <span className="text-xsmall14 mt-6 block font-semibold">
          총 결제 금액
        </span>
        <hr className="my-3" />
        <span className="text-small18 text-neutral-10 block text-right font-bold">
          {totalPrice.toLocaleString()}원
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
