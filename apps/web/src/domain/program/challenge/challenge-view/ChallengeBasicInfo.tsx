import { useProgramApplicationQuery } from '@/api/application';
import { useGetOpenMembershipPrivilege } from '@/domain/all-in-one-pass/api/privilege';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useOpenChallengeApply } from '../hooks/useOpenChallengeApply';
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
  ApplyButtonState,
  PlanTab,
} from './apply-header/ApplyPriceCard';
import PassPromoStrip from './apply-header/PassPromoStrip';

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

const ChallengeBasicInfo = ({
  challenge,
  challengeId,
  activeChallengeList,
}: {
  challenge: ChallengeIdSchema;
  challengeId: string | undefined;
  activeChallengeList: ActiveChallengeType[] | undefined;
}) => {
  const router = useRouter();
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

  /* 플랜: LIGHT 는 '템플릿으로 혼자', 나머지는 '실시간으로 함께' */
  const planTabs = useMemo(() => {
    const titleOf = (plan: ChallengePricePlan) =>
      challenge.priceInfo.find((item) => item.challengePricePlanType === plan)
        ?.title;
    const tabs: PlanTab[] = [
      { plan: 'BASIC', label: titleOf('BASIC') || '베이직' },
    ];
    (['STANDARD', 'PREMIUM'] as const).forEach((plan) => {
      if (
        challenge.priceInfo.some((item) => item.challengePricePlanType === plan)
      ) {
        tabs.push({ plan, label: titleOf(plan) || plan });
      }
    });
    return tabs;
  }, [challenge.priceInfo]);
  const hasLightPlan = challenge.priceInfo.some(
    (item) => item.challengePricePlanType === 'LIGHT',
  );
  const [livePlan, setLivePlan] = useState<ChallengePricePlan>('BASIC');
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const plan: ChallengePricePlan = isTemplateMode ? 'LIGHT' : livePlan;

  /* 참여 대상 = 버전 (LC-3247). 고르면 해당 버전 URL 로 이동한다 */
  const targetOptions: TargetOption[] = [...(challenge.versionList ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((version) => ({
      key: String(version.challengeVersionId),
      label: version.title,
      selected: version.challengeVersionId === currentVersionId,
      onSelect: () =>
        router.push(
          getProgramPathname({
            programType: 'challenge',
            id: numericChallengeId,
            title: version.programTitle ?? challenge.title ?? '',
            challengeVersionId: version.challengeVersionId,
          }),
        ),
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
      onSelect: () => router.push(getActiveChallengePathname(item)),
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
        onSelect: () => {},
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
    router,
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
  const passPrice =
    !hasPrivilege && showPassPrice && plan !== 'LIGHT'
      ? passPrices[plan]
      : null;

  return (
    <div className="flex w-full flex-col gap-y-6 md:gap-y-8">
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

      {/* 히어로 이미지 */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-md md:aspect-[5/1]"
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

      <div className="flex flex-col gap-2">
        <h1 className="text-medium22 font-bold text-neutral-0 md:text-xlarge30">
          {challenge.title}
        </h1>
        {challenge.shortDesc && (
          <p className="text-xsmall14 text-neutral-30 md:text-small18">
            {challenge.shortDesc}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
        <div className="md:flex-1">
          <ApplyOptionCard
            showModeSelect={hasLightPlan}
            mode={isTemplateMode ? 'TEMPLATE' : 'LIVE'}
            onChangeMode={(mode) => setIsTemplateMode(mode === 'TEMPLATE')}
            targetOptions={targetOptions}
            startDateOptions={startDateOptions}
          />
        </div>
        <div className="md:w-[380px] md:shrink-0">
          <ApplyPriceCard
            priceInfoList={challenge.priceInfo}
            plan={plan}
            planTabs={isTemplateMode ? [] : planTabs}
            onChangePlan={setLivePlan}
            applyState={applyState}
            onApply={() => openApply(plan)}
            passHref={passHref}
            passPrice={passPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeBasicInfo;
