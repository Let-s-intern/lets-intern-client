import useChallengeOptionPriceInfo from '@/hooks/useChallengeOptionPriceInfo';
import {
  ChallengePriceInfo,
  ChallengeType,
  challengeTypeSchema,
} from '@/schema';
import { challengeColors } from '@components/ChallengeView';

import PriceSummary from '@components/common/ui/PriceSummary';
import SectionHeader from '@components/ui/SectionHeader';
import SectionMainHeader from '@components/ui/SectionMainHeader';
import SectionSubHeader from '@components/ui/SectionSubHeader';
import { CSSProperties, memo, useMemo } from 'react';

const {
  PORTFOLIO,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
} = challengeTypeSchema.enum;

interface CardProps {
  title: string;
  description: string;
  originalPrice: number;
  discountAmount: number;
  paragraphStyle?: CSSProperties;
}

const PricePlanCard = memo(function PricePlanCard({
  title,
  description,
  originalPrice,
  discountAmount,
  paragraphStyle,
}: CardProps) {
  return (
    <div className="w-72 rounded-sm bg-white px-5 py-7 text-left text-neutral-0 md:flex-1">
      <h4 className="mb-6 text-xsmall16 font-bold md:text-small20">{title}</h4>
      <p
        style={paragraphStyle}
        className="mb-[52px] min-h-28 whitespace-pre-line rounded-xxs bg-[#F1F4FF] px-3 py-5 text-xsmall14 font-medium md:text-small18"
      >
        {description}
      </p>
      <PriceSummary
        originalPrice={originalPrice}
        discountPrice={discountAmount}
      />
    </div>
  );
});

interface Props {
  challengeType: ChallengeType;
  priceInfoList: ChallengePriceInfo[];
}

function ChallengePricePlanSection({ challengeType, priceInfoList }: Props) {
  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          primaryColor: challengeColors._4D55F5,
          primaryLightColor: challengeColors.F3F4FF,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,
          primaryLightColor: challengeColors.F0F4FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
        };
      // 자소서
      default:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
        };
    }
  }, [challengeType]);

  const paragraphStyle = { backgroundColor: styles.primaryLightColor };
  const subHeaderStyle = { color: styles.primaryColor };

  const basicePriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'BASIC',
  );
  const standardPriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'STANDARD',
  );
  const premiumPriceInfo = priceInfoList.find(
    (item) => item.challengePricePlanType === 'PREMIUM',
  );

  const {
    basicRegularPrice,
    basicDiscountAmount,
    standardRegularPrice,
    standardDiscountAmount,
    premiumRegularPrice,
    premiumDiscountAmount,
  } = useChallengeOptionPriceInfo(priceInfoList);

  return (
    <section className="w-full bg-neutral-90 px-5 pb-[8.75rem] pt-[6.25rem] text-center lg:px-0">
      <SectionHeader className="mb-6 md:mb-14">가격 구성</SectionHeader>
      <SectionSubHeader className="mb-1 md:mb-3" style={subHeaderStyle}>
        취준 비용 부담은 낮추고, 퀄리티는 높이고
      </SectionSubHeader>
      <SectionMainHeader className="mb-12">
        내게 가장 알맞은 구성을
        <br className="md:hidden" /> 선택할 수 있어요!
      </SectionMainHeader>
      {/* 좌우 슬라이드 */}
      <div className="-mx-5 overflow-x-auto px-5 md:max-w-[1000px] lg:mx-auto lg:px-0">
        <div className="flex min-w-fit items-center gap-3">
          <PricePlanCard
            paragraphStyle={paragraphStyle}
            title={basicePriceInfo?.title ?? ''}
            description={basicePriceInfo?.description ?? ''}
            originalPrice={basicRegularPrice}
            discountAmount={basicDiscountAmount}
          />
          {standardPriceInfo && (
            <PricePlanCard
              paragraphStyle={paragraphStyle}
              title={standardPriceInfo?.title ?? ''}
              description={standardPriceInfo?.description ?? ''}
              originalPrice={standardRegularPrice}
              discountAmount={standardDiscountAmount}
            />
          )}
          {premiumPriceInfo && (
            <PricePlanCard
              paragraphStyle={paragraphStyle}
              title={premiumPriceInfo?.title ?? ''}
              description={premiumPriceInfo?.description ?? ''}
              originalPrice={premiumRegularPrice}
              discountAmount={premiumDiscountAmount}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default ChallengePricePlanSection;
