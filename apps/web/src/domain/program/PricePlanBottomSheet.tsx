import { useProgramApplicationQuery } from '@/api/application';
import BaseBottomSheet from '@/common/sheet/BaseBottomSheet';
import { COUPON_DISABLED_CHALLENGE_TYPES } from '@/domain/program/program-detail/apply/constants';
import { generateOrderId, getPayInfo, UserInfo } from '@/lib/order';
import {
  ChallengeIdPrimitive,
  ChallengePricePlan,
  ChallengePricePlanEnum,
} from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import FeedbackMentoringLink from '@/domain/program/challenge/ui/FeedbackMentoringLink';
import { isVersionSelectRequired } from '@/domain/program/program-detail/apply/utils/challengeVersion';
import { getChallengeThemeColor } from '@/domain/program/challenge/utils/getChallengeThemeColor';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { RadioGroup } from '@mui/material';
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
  // 버전은 플랜보다 먼저 고른다. 신청 입력 화면은 여기서 고른 값을 이어받는다 (LC-3247)
  const [challengeVersionId, setChallengeVersionId] = useState<number | null>(
    null,
  );
  const versionList = challenge.versionList ?? [];
  const isVersionRequired = isVersionSelectRequired(versionList, pricePlan);
  const isVersionMissing = isVersionRequired && challengeVersionId === null;

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

  const handleApply = useCallback(() => {
    if (isVersionMissing) return;
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
      // 이전 신청에서 남은 값이 따라가지 않게 버전이 필요 없으면 비운다
      challengeVersionId: isVersionRequired ? challengeVersionId : null,
    });

    router.push(
      shouldPassB2BParam ? '/payment-input?source=b2b' : '/payment-input',
    );
  }, [
    application,
    pricePlan,
    isVersionMissing,
    isVersionRequired,
    challengeVersionId,
    finalPriceInfo.regularPrice,
    finalPriceInfo.discountPrice,
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
        {/* 챌린지 버전 — 플랜보다 먼저 고른다. LIGHT 는 버전을 쓰지 않는다 */}
        {isVersionRequired && (
          <>
            <div className="mb-4 mt-3 flex items-center justify-between">
              <span className="required-star text-xsmall14 font-semibold">
                챌린지 버전 선택 (필수)
              </span>
            </div>
            <OptionDropdown
              label={`${challenge.title} 버전`}
              wrapperClassName="w-full"
            >
              <RadioGroup
                aria-label="챌린지 버전 선택"
                value={
                  challengeVersionId === null ? '' : String(challengeVersionId)
                }
                onChange={(_, v) => setChallengeVersionId(Number(v))}
              >
                {versionList.map((version, index) => (
                  <OptionFormRadioControlLabel
                    key={version.challengeVersionId}
                    label={<b className="font-bold">{version.title}</b>}
                    value={String(version.challengeVersionId)}
                    wrapperClassName={
                      index < versionList.length - 1
                        ? 'py-3 pl-2 pr-3 border-b border-neutral-80'
                        : 'py-3 pl-2 pr-3'
                    }
                  />
                ))}
              </RadioGroup>
            </OptionDropdown>
            {/* 선택 여부로 문구를 넣고 빼면 아래에 붙은 시트 높이가 바뀌어 화면이 튄다. 항상 같은 문구를 둔다 */}
            <p className="text-xxsmall12 text-neutral-40 mt-2">
              버전은 신청 후 한 번만 변경할 수 있어요.
            </p>
          </>
        )}

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

        {/* 총 결제 금액 */}
        <span className="text-xsmall14 mt-6 block font-semibold">
          총 결제 금액
        </span>
        <hr className="my-3" />
        <span className="text-small18 text-neutral-10 block text-right font-bold">
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
            disabled={isVersionMissing}
          >
            신청하기
          </BaseButton>
        </section>
      </BaseBottomSheet>
    </>
  );
}

export default PricePlanBottomSheet;
