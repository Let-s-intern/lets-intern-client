import { useProgramApplicationQuery } from '@/api/application';
import {
  useGetMembershipPrivilege,
  useGetOpenMembershipPrivilege,
} from '@/domain/all-in-one-pass/api/privilege';
import { challengeColors } from '@/domain/program/challenge/challengeColors';
import useScrollDirection from '@/hooks/useScrollDirection';
import dayjs from '@/lib/dayjs';
import { twMerge } from '@/lib/twMerge';
import {
  ActiveChallengeType,
  ChallengeIdSchema,
  ChallengePricePlan,
  challengeTypeSchema,
} from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import { getProgramPathname } from '@/utils/url';
import Image from 'next/image';
import ChallengeThumbnail from './thumbnail/ChallengeThumbnail';
import DetailGallery from './thumbnail/DetailGallery';
import {
  getChallengeDisplayTitle,
  resolveChallengeThumbnail,
} from './thumbnail/resolveThumbnail';
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

  const scrollDirection = useScrollDirection();
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
  const defaultThumbnail = resolveChallengeThumbnail(
    challenge.title ?? '',
    getChallengeDisplayTitle(challenge.title ?? ''),
    challenge.challengeType,
  );

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

      {/*
       * 스마트스토어형 상단. 데스크톱은 왼쪽 이미지·제목을 고정하고 오른쪽 옵션·가격이 스크롤을 따라 움직인다.
       * 헤더가 위로 스크롤할 때만 다시 나타나므로 고정 위치도 그에 맞춘다.
       */}
      <div className="mt-6 flex flex-col gap-6 md:mt-10 lg:grid lg:grid-cols-2 lg:items-start lg:gap-[60px]">
        <div
          className={twMerge(
            'flex flex-col transition-[top] lg:sticky',
            scrollDirection === 'UP'
              ? 'duration-300 lg:top-[179px]'
              : 'duration-200 lg:top-6',
          )}
        >
          <DetailGallery
            challengeType={challenge.challengeType}
            style={styles.thumbnailStyle}
            main={
              <div className="relative h-full w-full">
                {/* 기수·버전이 박힌 등록 썸네일 대신 유형별 기본 썸네일. 기본 이미지가 없는 유형만 등록 썸네일 */}
                {defaultThumbnail ? (
                  <ChallengeThumbnail
                    challengeType={challenge.challengeType}
                    title={challenge.title ?? ''}
                    displayTitle={getChallengeDisplayTitle(
                      challenge.title ?? '',
                    )}
                  />
                ) : (
                  (challenge.thumbnail || challenge.desktopThumbnail) && (
                    <Image
                      className="object-contain"
                      src={
                        (challenge.thumbnail ||
                          challenge.desktopThumbnail) as string
                      }
                      alt={`${challenge.title} 썸네일`}
                      fill={true}
                      sizes="(min-width: 1024px) 550px, 100vw"
                      priority
                    />
                  )
                )}
              </div>
            }
          />

          <div className="mt-4 flex flex-col gap-2 md:mt-6 md:gap-3">
            <h1 className="text-medium22 font-bold text-neutral-0 md:text-xlarge28">
              {challenge.title}
            </h1>
            {challenge.shortDesc && (
              <p className="text-xsmall14 text-neutral-30 md:text-xsmall16">
                {challenge.shortDesc}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-3">
            <h2 className="text-small18 font-bold text-neutral-0 md:text-medium22">
              나에게 맞는 프로그램 선택하기
            </h2>
            <ApplyOptionCard
              showModeSelect={guidebook !== null}
              mode={showTemplate ? 'TEMPLATE' : 'LIVE'}
              onChangeMode={(mode) => setTemplateMode(mode === 'TEMPLATE')}
              targetOptions={targetOptions}
              startDateOptions={startDateOptions}
            />
          </div>
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
                  label={`${priceSummary.paymentPrice.toLocaleString()}원에 신청하기`}
                  onClick={() => openApply(cheapestPlan)}
                />
              )
            }
            passHref={passHref}
            passPrice={passPrice}
            membershipId={
              (openPrivilege?.openCount ?? 0) === 1
                ? (openPrivilege?.membershipId ?? null)
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeBasicInfo;
