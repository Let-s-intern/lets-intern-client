import { useProgramApplicationQuery } from '@/api/application';
import {
  useGetMembershipPrivilege,
  useGetOpenMembershipPrivilege,
} from '@/domain/all-in-one-pass/api/privilege';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import dayjs from '@/lib/dayjs';
import {
  ActiveChallengeType,
  ChallengeIdSchema,
  ChallengePricePlan,
  challengeTypeSchema,
} from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { getProgramPathname } from '@/utils/url';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useChallengePlanPrice } from '../hooks/useChallengePlanPrice';
import { useOpenChallengeApply } from '../hooks/useOpenChallengeApply';
import { useChallengeApplySheetStore } from '../store/useChallengeApplySheetStore';
import { useChallengePassBenefit } from '../useChallengePassBenefit';
import {
  getActiveChallengePathname,
  getActiveChallengeTag,
  isActiveChallengeSelected,
  sortActiveChallenges,
} from '../utils/activeChallengeRadio';
import ApplyOptionCard, {
  StartDateOption,
  TargetOption,
} from './apply-header/ApplyOptionCard';
import ApplyPriceCard, {
  ApplyButton,
  ApplyButtonState,
  PriceSummary,
} from './apply-header/ApplyPriceCard';
import PassPromoStrip from './apply-header/PassPromoStrip';
import TemplateApplyButton from '../template-guidebook/TemplateApplyButton';
import { useTemplateGuidebook } from '../template-guidebook/useTemplateGuidebook';

const {
  CAREER_START,
  PORTFOLIO,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
  ETC,
} = challengeTypeSchema.enum;

export const getDiscountPercent = (
  originalPrice: number,
  discountPrice: number,
): number => {
  if (originalPrice === 0) return 0;
  return Math.round((discountPrice / originalPrice) * 100);
};

const hasPlan = (
  priceInfo: ChallengeIdSchema['priceInfo'],
  plan: ChallengePricePlan,
) => priceInfo.some((item) => item.challengePricePlanType === plan);

const ChallengeBasicInfo = ({
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

  const styles = useMemo(() => {
    switch (challenge.challengeType) {
      case CAREER_START:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.EDEEFE,
          },
          basicInfoStyle: {
            color: challengeColors._4D55F5,
          },
        };
      case PORTFOLIO:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.FFF4DB,
          },
          basicInfoStyle: {
            color: challengeColors._4A76FF,
          },
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.E6F9DE,
          },
          basicInfoStyle: {
            color: challengeColors._32B750,
          },
        };
      case EXPERIENCE_SUMMARY:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          basicInfoStyle: {
            color: challengeColors.F26646,
          },
        };
      case ETC:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.FFF6F4,
          },
          basicInfoStyle: {
            color: challengeColors.F26646,
          },
        };
      default:
        return {
          thumbnailStyle: {
            backgroundColor: challengeColors.EEFAFF,
          },
          basicInfoStyle: {
            color: challengeColors._14BCFF,
          },
        };
    }
  }, [challenge.challengeType]);

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
  const { hasPrivilege, showPassPrice, passHref, passPrices } =
    useChallengePassBenefit({
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
    ? openHasGuidebook && !guidebookPrivilege?.hasPrivilege
      ? 0
      : null
    : !hasPrivilege && showPassPrice
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
        membershipDiscount: 0,
        deposit: 0,
        paymentPrice: guidebook.price - guidebook.discount,
      }
    : {
        regularPrice: livePrice.regularPrice,
        discountAmount: livePrice.discountAmount,
        discountPercentage: livePrice.discountPercentage,
        membershipDiscount: livePrice.isPassApplied
          ? livePrice.membershipDiscount
          : 0,
        deposit: livePrice.showDeposit ? livePrice.deposit : 0,
        paymentPrice: livePrice.paymentPrice,
      };

  return (
    <div className="flex w-full flex-col">
      {passHref && (
        <PassPromoStrip
          passHref={passHref}
          membershipId={
            (openPrivilege?.openCount ?? 0) === 1
              ? (openPrivilege?.membershipId ?? null)
              : null
          }
        />
      )}

      {/* 히어로 이미지. 시안처럼 아래 모서리는 제목과 바로 이어진다 */}
      <div
        className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-t-md md:mt-10 md:aspect-[5/1]"
        style={styles.thumbnailStyle}
      >
        {(challenge.desktopThumbnail || challenge.thumbnail) && (
          <Image
            className="object-contain md:object-cover"
            src={(challenge.desktopThumbnail || challenge.thumbnail) as string}
            alt={`${challenge.title} 썸네일`}
            fill={true}
            priority
          />
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2 md:mt-4 md:gap-3">
        <h1 className="text-medium22 font-bold text-neutral-0 md:text-xxlarge32">
          {challenge.title}
        </h1>
        {challenge.shortDesc && (
          <p className="text-xsmall14 text-neutral-30 md:text-small18">
            {challenge.shortDesc}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 md:mt-8 md:flex-row md:items-stretch md:justify-between md:gap-8">
        <div className="md:flex-1 lg:max-w-[600px]">
          <ApplyOptionCard
            showModeSelect={guidebook !== null}
            mode={showTemplate ? 'TEMPLATE' : 'LIVE'}
            onChangeMode={(mode) => setTemplateMode(mode === 'TEMPLATE')}
            targetOptions={targetOptions}
            startDateOptions={startDateOptions}
          />
        </div>
        <div className="md:w-[340px] md:shrink-0 lg:w-[450px]">
          <ApplyPriceCard
            price={priceSummary}
            applyButton={
              showTemplate ? (
                <TemplateApplyButton
                  guidebookId={guidebook.id}
                  title={guidebook.title}
                />
              ) : (
                <ApplyButton
                  state={applyState}
                  label="챌린지 신청하기"
                  onClick={() => openApply(cheapestPlan)}
                />
              )
            }
            passHref={passHref}
            passPrice={passPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeBasicInfo;
