import { challengeColors } from '@/domain/program/challenge/challengeColors';
import useScrollDirection from '@/hooks/useScrollDirection';
import { twMerge } from '@/lib/twMerge';
import {
  ActiveChallengeType,
  ChallengeIdSchema,
  challengeTypeSchema,
} from '@/schema';
import Image from 'next/image';
import { useMemo } from 'react';
import { useChallengeApplyPanel } from '../hooks/useChallengeApplyPanel';
import TemplateApplyButton from '../template-guidebook/TemplateApplyButton';
import ApplyOptionCard from './apply-header/ApplyOptionCard';
import ApplyPriceCard from './apply-header/ApplyPriceCard';
import PassPromoStrip from './apply-header/PassPromoStrip';
import { getApplyAccentStyle } from './apply-header/applyAccent';
import PlanSelectCard from './apply-header/PlanSelectCard';
import ChallengeThumbnail from './thumbnail/ChallengeThumbnail';
import DetailGallery from './thumbnail/DetailGallery';
import {
  getChallengeDisplayTitle,
  resolveChallengeThumbnail,
} from './thumbnail/resolveThumbnail';

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
  const {
    openApply,
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
  } = useChallengeApplyPanel({ challenge, challengeId, activeChallengeList });
  const defaultThumbnail = resolveChallengeThumbnail(
    challenge.title ?? '',
    getChallengeDisplayTitle(challenge.title ?? ''),
    challenge.challengeType,
  );

  return (
    <div
      className="flex w-full flex-col"
      style={getApplyAccentStyle(challenge.challengeType)}
    >
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
      <div className="mt-6 flex flex-col gap-6 md:mt-10 lg:grid lg:grid-cols-[1fr_1px_1fr] lg:items-start lg:gap-10 lg:px-8">
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
            imageSrc={
              defaultThumbnail?.src ??
              (challenge.thumbnail || challenge.desktopThumbnail)
            }
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
        </div>

        {/* 이미지와 신청 영역 사이 구분선 */}
        <div
          aria-hidden
          className="hidden w-px self-stretch bg-neutral-85 lg:block"
        />

        <div className="flex flex-col gap-3 md:gap-4">
          <div className="flex flex-col gap-3">
            {/* 제목·한 줄 소개는 "나에게 맞는 프로그램 선택하기" 자리에 둔다 */}
            <div className="flex flex-col gap-1.5 md:gap-2">
              <h1 className="text-medium22 font-bold text-neutral-0 md:text-xlarge28">
                {getChallengeDisplayTitle(challenge.title ?? '')}
              </h1>
              {challenge.shortDesc && (
                <p className="text-xsmall14 text-neutral-30 md:text-xsmall16">
                  {challenge.shortDesc}
                </p>
              )}
            </div>
            <ApplyOptionCard
              showModeSelect={guidebook !== null}
              mode={showTemplate ? 'TEMPLATE' : 'LIVE'}
              onChangeMode={(mode) => setTemplateMode(mode === 'TEMPLATE')}
              targetOptions={targetOptions}
              startDateOptions={startDateOptions}
            />
          </div>
          {/* 1024px 까지는 옵션 선택·신청을 하단 플로팅 바(시트)로만 한다 */}
          <div className="hidden min-[1025px]:block">
            {showTemplate && guidebook ? (
              <ApplyPriceCard
                price={priceSummary}
                applyButton={
                  <TemplateApplyButton
                    guidebookId={guidebook.id}
                    title={guidebook.title}
                  />
                }
                passHref={passHref}
                passPrice={passPrice}
                membershipId={
                  (openPrivilege?.openCount ?? 0) === 1
                    ? (openPrivilege?.membershipId ?? null)
                    : null
                }
              />
            ) : (
              // 챌린지 시작일까지 고른 뒤 플랜을 고른다. 시작일은 지금 보는 기수가 기본으로 골라져 있다
              startDateOptions.some((option) => option.selected) && (
                <PlanSelectCard
                  options={planOptions}
                  selectedPlan={selectedPlan}
                  onSelect={setSheetPlan}
                  applyState={applyState}
                  onApply={(plan) => openApply(plan)}
                  passHref={passHref}
                  passPrice={selectedPlanPassPrice}
                  priceSummary={priceSummary}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeBasicInfo;
