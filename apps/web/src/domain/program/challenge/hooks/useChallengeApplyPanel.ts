import { useProgramApplicationQuery } from '@/api/application';
import {
  useGetMembershipPrivilege,
  useGetOpenMembershipPrivilege,
} from '@/domain/all-in-one-pass/api/privilege';
import dayjs from '@/lib/dayjs';
import {
  ActiveChallengeType,
  ChallengeIdSchema,
  ChallengePricePlan,
} from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { getProgramPathname } from '@/utils/url';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import type {
  StartDateOption,
  TargetOption,
} from '../challenge-view/apply-header/ApplyOptionCard';
import type {
  ApplyButtonState,
  PriceSummary,
} from '../challenge-view/apply-header/ApplyPriceCard';
import { buildPlanOptions } from '../challenge-view/apply-header/planOptions';
import { useChallengeApplySheetStore } from '../store/useChallengeApplySheetStore';
import { useTemplateGuidebook } from '../template-guidebook/useTemplateGuidebook';
import { useChallengePassBenefit } from '../useChallengePassBenefit';
import {
  getActiveChallengePathname,
  getActiveChallengeTag,
  isActiveChallengeSelected,
  sortActiveChallenges,
} from '../utils/activeChallengeRadio';
import { useChallengePlanPrice } from './useChallengePlanPrice';
import { useOpenChallengeApply } from './useOpenChallengeApply';

const hasPlan = (
  priceInfo: ChallengeIdSchema['priceInfo'],
  plan: ChallengePricePlan,
) => priceInfo.some((item) => item.challengePricePlanType === plan);

/**
 * 상세 상단 패널과 스크롤을 따라오는 패널이 같이 쓰는 신청 정보.
 * 옵션(진행 방식·참여 대상·시작일)·플랜·가격·신청 버튼 상태를 한곳에서 계산한다
 */
export const useChallengeApplyPanel = ({
  challenge,
  challengeId,
  activeChallengeList,
}: {
  challenge: ChallengeIdSchema;
  challengeId: string | undefined;
  activeChallengeList: ActiveChallengeType[] | undefined;
}) => {
  // 상세 page 가 version 파라미터를 검증한 뒤 렌더하므로 그대로 믿는다
  const versionParam = useSearchParams().get('version');
  const currentVersionId = versionParam ? Number(versionParam) : null;

  const openApply = useOpenChallengeApply();
  const numericChallengeId = Number(challengeId);

  /*
   * 실시간으로 함께: 가장 낮은 금액의 플랜을 보이고, 플랜은 결제 시트에서 고른다.
   * 템플릿으로 혼자: 챌린지 타입에 연결된 가이드북의 가격·결제를 보인다 (LC-3631).
   */
  const cheapestPlan = useMemo<ChallengePricePlan>(() => {
    const prices = getChallengeOptionPriceInfo(challenge.priceInfo);
    const candidates: [ChallengePricePlan, number][] = [
      ['BASIC', prices.basicRegularPrice - prices.basicDiscountAmount],
    ];
    if (hasPlan(challenge.priceInfo, 'STANDARD')) {
      candidates.push([
        'STANDARD',
        prices.standardRegularPrice - prices.standardDiscountAmount,
      ]);
    }
    if (hasPlan(challenge.priceInfo, 'PREMIUM')) {
      candidates.push([
        'PREMIUM',
        prices.premiumRegularPrice - prices.premiumDiscountAmount,
      ]);
    }
    return candidates.reduce((min, cur) => (cur[1] < min[1] ? cur : min))[0];
  }, [challenge.priceInfo]);
  const livePrice = useChallengePlanPrice(challenge.priceInfo, cheapestPlan);

  const { guidebook } = useTemplateGuidebook(challenge.challengeType);

  const isTemplateMode = useChallengeApplySheetStore(
    (state) => state.isTemplateMode,
  );
  const setTemplateMode = useChallengeApplySheetStore(
    (state) => state.setTemplateMode,
  );
  const showTemplate = isTemplateMode && guidebook !== null;

  // 하단 고정 바와 결제 시트가 같은 플랜으로 열리도록 공유한다
  const setSheetPlan = useChallengeApplySheetStore((state) => state.setPlan);
  useEffect(() => {
    setSheetPlan(cheapestPlan);
  }, [cheapestPlan, setSheetPlan]);

  /* 참여 대상 = 버전 (LC-3247). 고르면 해당 버전 URL 로 이동한다 */
  const targetOptions: TargetOption[] = [...(challenge.versionList ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((version) => ({
      key: String(version.challengeVersionId),
      label: version.title,
      selected: version.challengeVersionId === currentVersionId,
      href: getProgramPathname({
        programType: 'challenge',
        id: numericChallengeId,
        title: version.programTitle ?? challenge.title ?? '',
        challengeVersionId: version.challengeVersionId,
      }),
    }));

  /* 시작일 = 같은 버전으로 모집 중인 기수. 지금 챌린지가 목록에 없으면 앞에 넣는다 */
  const startDateOptions: StartDateOption[] = useMemo(() => {
    const sameVersion = sortActiveChallenges(activeChallengeList ?? []).filter(
      (item) => (item.challengeVersionId ?? null) === currentVersionId,
    );
    const options: StartDateOption[] = sameVersion.map((item) => ({
      key: `${item.id}-${item.challengeVersionId ?? ''}`,
      startDate: item.startDate,
      endDate: item.endDate,
      deadline: item.deadline ?? null,
      // 버전 데이터가 있으면 참여 대상에서 고르므로 태그가 필요 없다
      tag: currentVersionId === null ? getActiveChallengeTag(item) : null,
      selected: isActiveChallengeSelected(
        item,
        numericChallengeId,
        currentVersionId,
      ),
      href: getActiveChallengePathname(item),
    }));
    if (
      !options.some((option) => option.selected) &&
      challenge.startDate &&
      challenge.endDate
    ) {
      options.unshift({
        key: `current-${numericChallengeId}`,
        startDate: challenge.startDate.format(),
        endDate: challenge.endDate.format(),
        deadline: challenge.deadline?.format() ?? null,
        tag: null,
        selected: true,
        href: '',
      });
    }
    return options;
  }, [
    activeChallengeList,
    currentVersionId,
    numericChallengeId,
    challenge.startDate,
    challenge.endDate,
    challenge.deadline,
  ]);

  /* 신청 버튼 상태: 하단 CTA 와 같은 기준 */
  const { data: application } = useProgramApplicationQuery(
    'challenge',
    numericChallengeId,
  );
  const isOutOfDate =
    challenge.beginning && challenge.deadline
      ? dayjs().isBefore(challenge.beginning) ||
        dayjs().isAfter(challenge.deadline)
      : false;
  const applyState: ApplyButtonState = isOutOfDate
    ? 'CLOSED'
    : application?.applied
      ? 'APPLIED'
      : 'OPEN';

  /* 올인원 패스: 열린 패스 링크와 이 플랜의 패스회원가 */
  const { showPassPrice, passHref, passPrices } = useChallengePassBenefit({
    challengeId: challengeId ?? '',
    enabled: challengeId !== undefined,
    prices: getChallengeOptionPriceInfo(challenge.priceInfo),
  });
  const { data: openPrivilege } = useGetOpenMembershipPrivilege();
  // 템플릿 모드: 열린 패스에 가이드북 권한이 있으면 패스로 0원에 받을 수 있다
  const { data: guidebookPrivilege } = useGetMembershipPrivilege(
    'GUIDEBOOK',
    guidebook?.id ?? -1,
  );
  const openHasGuidebook =
    !!openPrivilege?.exists &&
    openPrivilege.privilegeList.some((p) => p.programType === 'GUIDEBOOK');
  const passPrice = showTemplate
    ? openHasGuidebook || guidebookPrivilege?.hasPrivilege
      ? 0
      : null
    : showPassPrice
      ? passPrices[cheapestPlan as 'BASIC' | 'STANDARD' | 'PREMIUM']
      : null;

  const priceSummary: PriceSummary = showTemplate
    ? {
        regularPrice: guidebook.price,
        discountAmount: guidebook.discount,
        discountPercentage:
          guidebook.price > 0
            ? Math.round((guidebook.discount / guidebook.price) * 100)
            : 0,
        deposit: 0,
        paymentPrice: guidebook.price - guidebook.discount,
      }
    : {
        regularPrice: livePrice.regularPrice,
        discountAmount: livePrice.discountAmount,
        discountPercentage: livePrice.discountPercentage,
        // 시안대로 가격 카드는 패스 혜택을 빼고 원래 금액만 보인다. 패스 금액은 아래 패스 카드·모달에서 보인다
        deposit: livePrice.deposit,
        paymentPrice: livePrice.sellingPrice,
      };

  const selectedPlan = useChallengeApplySheetStore((state) => state.plan);
  const planOptions = buildPlanOptions(
    challenge.priceInfo,
    showPassPrice ? passPrices : null,
  );
  const selectedPlanPassPrice =
    showPassPrice && selectedPlan && selectedPlan !== 'LIGHT'
      ? passPrices[selectedPlan]
      : null;

  return {
    openApply,
    cheapestPlan,
    guidebook,
    showTemplate,
    setTemplateMode,
    setSheetPlan,
    targetOptions,
    startDateOptions,
    applyState,
    passHref,
    passPrice,
    openPrivilege,
    priceSummary,
    planOptions,
    selectedPlan,
    selectedPlanPassPrice,
  };
};
