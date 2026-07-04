import { Fragment, useMemo } from 'react';

import SectionHeader from '@/common/header/SectionHeader';
import { ChallengeIdPrimitive } from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import getChallengeSchedule from '@/utils/getChallengeSchedule';
import MainTitle from '../ui/MainTitle';
import { getChallengeThemeColor } from '../utils/getChallengeThemeColor';
import Box from './recruitment-info-section/Box';
import InfoRow from './recruitment-info-section/InfoRow';
import Label from './recruitment-info-section/Label';
import PlanRow from './recruitment-info-section/PlanRow';
import { PriceInfo } from './recruitment-info-section/types';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const RecruitmentInfoSection = ({ challenge }: Props) => {
  const themeColor = getChallengeThemeColor(challenge.challengeType);
  const { startDate, deadline, startDateWithTime, endDateWithTime } =
    getChallengeSchedule(challenge);

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

      if (planType === 'BASIC' || planType === 'LIGHT') {
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
    const lightPlan = createPlan(
      'LIGHT',
      '라이트',
      lightRegularPrice,
      lightDiscountAmount,
    );

    if (basicPlan) result.push(basicPlan);
    if (standardPlan) result.push(standardPlan);
    if (premiumPlan) result.push(premiumPlan);
    if (lightPlan) result.push(lightPlan);

    return result;
  }, [
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
    lightRegularPrice,
    lightDiscountAmount,
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
              themeColor={themeColor}
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
              themeColor={themeColor}
            />
          </Box>

          <Box className="gap-6">
            <InfoRow
              label="모집 마감"
              value={deadline}
              themeColor={themeColor}
            />
            <InfoRow
              label="OT 일자"
              value="챌린지 대시보드 입장 후 0회차 미션을 통해 OT 영상 시청 부탁드립니다."
              themeColor={themeColor}
            />
            <InfoRow
              label="진행방식"
              value="100% 온라인"
              themeColor={themeColor}
            />
          </Box>
        </div>

        {/* 우측: 가격 플랜 */}
        <Box className="flex-1">
          <Label themeColor={themeColor}>가격</Label>
          <div className="mt-2 flex flex-col gap-3.5">
            {plans.map((plan, index) => {
              const isLast = index === plans.length - 1;

              return (
                <Fragment key={plan.planType}>
                  <PlanRow plan={plan} />
                  {!isLast && (
                    <hr className="bg-neutral-80 h-[1px] w-full border-none" />
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

export default RecruitmentInfoSection;
