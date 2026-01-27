import { Fragment, ReactNode, useMemo } from 'react';

import SectionHeader from '@/common/header/SectionHeader';
import { twMerge } from '@/lib/twMerge';
import { ChallengeIdPrimitive } from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import getChallengeSchedule from '@/utils/getChallengeSchedule';
import MainTitle from '../ui/MainTitle';
import { getChallengeThemeColor } from '../utils/getChallengeThemeColor';

const DEFAULT_COLOR = getChallengeThemeColor('HR');

interface PriceInfo {
  title: string;
  originalPrice: number;
  discountAmount: number;
  description: string;
  planType: 'BASIC' | 'STANDARD' | 'PREMIUM';
}

interface Props {
  challenge: ChallengeIdPrimitive;
}

const Box = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col items-stretch rounded-sm bg-neutral-95 px-4 py-7 md:flex-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

const Label = ({
  children,
  themeColor = DEFAULT_COLOR,
}: {
  children?: ReactNode;
  themeColor?: string;
}) => {
  return (
    <span
      className="text-xsmall16 font-semibold md:text-xsmall16"
      style={{ color: themeColor }}
    >
      {children}
    </span>
  );
};

const InfoRow = ({
  label,
  value,
  themeColor = DEFAULT_COLOR,
}: {
  label: string;
  value: ReactNode;
  themeColor?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Label themeColor={themeColor}>{label}</Label>
      <p className="whitespace-pre-line text-xsmall16 font-medium text-neutral-0 md:text-xsmall16">
        {value}
      </p>
    </div>
  );
};

const PriceView = ({
  originalPrice,
  discountAmount,
}: {
  originalPrice: number;
  discountAmount: number;
}) => {
  const hasDiscount = discountAmount > 0;
  const sellingPrice = originalPrice - discountAmount;
  const percent = hasDiscount
    ? ((discountAmount / originalPrice) * 100).toFixed(0)
    : null;

  return (
    <div className="mt-5 flex shrink-0 flex-col text-left md:mt-0 md:items-end md:text-right">
      {hasDiscount && percent && (
        <span className="inline-flex gap-1 text-xsmall14">
          <span className="font-semibold text-system-error/90">{percent}%</span>
          <span className="font-medium text-neutral-40 line-through">
            {originalPrice.toLocaleString()}원
          </span>
        </span>
      )}

      <span className="text-medium20 font-bold text-neutral-0">
        {sellingPrice.toLocaleString()}원
      </span>
    </div>
  );
};

const PlanBenefits = ({
  description,
  isBasic,
}: {
  description: string;
  isBasic: boolean;
}) => {
  const lines = description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <ul className="mt-3 space-y-1.5 text-left text-xsmall16 text-[#606060]">
      {lines.map((line) => (
        <li key={line} className="flex items-start gap-1.5">
          <span className={twMerge('text-[#606060] md:text-xsmall16')}>
            {isBasic ? '✓' : '+'}
          </span>
          <span className="whitespace-pre-line">{line}</span>
        </li>
      ))}
      {!isBasic && (
        <li className="flex items-start gap-1.5">
          <span className="text-[#606060] md:text-xsmall16">+</span>
          <span className="whitespace-pre-line">
            베이직에서 제공되는 모든 사항 포함
          </span>
        </li>
      )}
    </ul>
  );
};

const PlanRow = ({ plan }: { plan: PriceInfo }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-3.5">
      <div className="flex-1">
        <div className="text-xsmall16 font-semibold text-neutral-0">
          {plan.title}
        </div>
        <PlanBenefits
          description={plan.description}
          isBasic={plan.planType === 'BASIC'}
        />
      </div>
      <PriceView
        originalPrice={plan.originalPrice}
        discountAmount={plan.discountAmount}
      />
    </div>
  );
};

const HrRecruitmentInfoSection = ({ challenge }: Props) => {
  const { startDate, deadline, startDateWithTime, endDateWithTime } =
    getChallengeSchedule(challenge);

  const {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
  } = getChallengeOptionPriceInfo(challenge.priceInfo);

  const plans: PriceInfo[] = useMemo(() => {
    const findByPlanType = (planType: PriceInfo['planType']) =>
      challenge.priceInfo.find(
        (item) => item.challengePricePlanType === planType,
      );

    const splitLines = (description: string) =>
      description
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

    const basicInfo = findByPlanType('BASIC');
    const basicLines = new Set(splitLines(basicInfo?.description ?? ''));

    const getDescription = (planType: PriceInfo['planType']) => {
      const info = findByPlanType(planType);
      if (!info?.description) return '';

      const lines = splitLines(info.description);

      if (planType === 'BASIC') {
        return lines.join('\n');
      }

      const filtered = lines.filter((line) => !basicLines.has(line));
      return filtered.join('\n');
    };

    const createPlan = (
      planType: PriceInfo['planType'],
      fallbackTitle: string,
      originalPrice: number,
      discountAmount: number,
    ): PriceInfo | null => {
      if (originalPrice === 0) return null;

      const info = findByPlanType(planType);

      return {
        title: info?.title || fallbackTitle,
        originalPrice,
        discountAmount,
        description: getDescription(planType),
        planType,
      };
    };

    const result: PriceInfo[] = [];

    const basicPlan = createPlan(
      'BASIC',
      '베이직',
      basicRegularPrice,
      basicDiscountAmount,
    );
    const standardPlan = createPlan(
      'STANDARD',
      '스탠다드',
      standardRegularPrice,
      standardDiscountAmount,
    );
    const premiumPlan = createPlan(
      'PREMIUM',
      '프리미엄',
      premiumRegularPrice,
      premiumDiscountAmount,
    );

    if (basicPlan) result.push(basicPlan);
    if (standardPlan) result.push(standardPlan);
    if (premiumPlan) result.push(premiumPlan);

    return result;
  }, [
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
    challenge.priceInfo,
  ]);

  return (
    <section
      id="pricing"
      className="flex scroll-mt-[56px] flex-col items-center px-5 pb-10 pt-16 md:scroll-mt-[100px] md:px-0 md:pb-[120px] md:pt-[100px]"
    >
      <SectionHeader className="mb-10 w-full text-left md:mb-[42px] md:text-center">
        가격 플랜
      </SectionHeader>
      <MainTitle className="mb-5 flex flex-col items-center md:mb-[100px]">
        모집 개요
      </MainTitle>
      <div className="flex w-full min-w-[320px] max-w-[1000px] flex-col gap-4 md:flex-row md:gap-3">
        {/* 좌측: 모집 정보  */}
        <div className="flex w-full flex-col gap-3 md:w-[325px] md:flex-none">
          <Box className="gap-6">
            <InfoRow
              label="시작 일자"
              value={startDate}
              themeColor={DEFAULT_COLOR}
            />
            <InfoRow
              label="진행 기간"
              value={
                <>
                  {startDateWithTime} -
                  <br />
                  {endDateWithTime}
                </>
              }
              themeColor={DEFAULT_COLOR}
            />
          </Box>

          <Box className="gap-6">
            <InfoRow
              label="모집 마감"
              value={deadline}
              themeColor={DEFAULT_COLOR}
            />
            <InfoRow
              label="OT 일자"
              value="챌린지 대시보드 입장 후 0회차 미션을 통해 OT 영상 시청 부탁드립니다."
              themeColor={DEFAULT_COLOR}
            />
            <InfoRow
              label="진행방식"
              value="100% 온라인"
              themeColor={DEFAULT_COLOR}
            />
          </Box>
        </div>

        {/* 우측: 가격 플랜 */}
        <Box className="flex-1">
          <Label themeColor={DEFAULT_COLOR}>가격</Label>
          <div className="mt-2 flex flex-col gap-3.5">
            {plans.map((plan, index) => {
              const isLast = index === plans.length - 1;

              return (
                <Fragment key={plan.planType}>
                  <PlanRow plan={plan} />
                  {!isLast && (
                    <hr className="h-[1px] w-full border-none bg-neutral-80" />
                  )}
                </Fragment>
              );
            })}
          </div>
        </Box>
      </div>
    </section>
  );
};

export default HrRecruitmentInfoSection;
