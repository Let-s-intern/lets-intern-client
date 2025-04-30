import useChallengeOptionPriceInfo from '@/hooks/useChallengeOptionPriceInfo';
import {
  ChallengePriceInfo,
  ChallengeType,
  challengeTypeSchema,
} from '@/schema';
import { challengeColors } from '@components/ChallengeView';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import Heading2 from '@components/common/ui/Heading2';
import PriceView from '@components/common/ui/PriceView';
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
    <div className="flex-1 rounded-sm bg-white px-5 py-7 text-left">
      <h4 className="mb-6 text-small20 font-bold">{title}</h4>
      <p
        style={paragraphStyle}
        className="mb-[52px] min-h-28 whitespace-pre-line rounded-xxs bg-[#F1F4FF] px-3 py-5 text-small18 font-medium"
      >
        {description}
      </p>
      <PriceView price={originalPrice} discount={discountAmount} />
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
          borderColor: challengeColors._4D55F5,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,
          primaryLightColor: challengeColors.F0F4FF,
          borderColor: challengeColors._4A76FF,
        };
      case PERSONAL_STATEMENT_LARGE_CORP:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
          borderColor: challengeColors._14BCFF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
          borderColor: challengeColors.FFC6B9,
        };
      // 자소서
      default:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
          borderColor: challengeColors._14BCFF,
        };
    }
  }, [challengeType]);

  const paragraphStyle = { backgroundColor: styles.primaryLightColor };

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
    <section className="w-full bg-neutral-90 text-center">
      <span className="text-xsmall16 font-bold text-neutral-45 md:text-small18">
        가격 구성
      </span>
      <SuperTitle style={{ color: styles.primaryColor }}>
        취준 비용 부담은 낮추고, 퀄리티는 높이고
      </SuperTitle>
      <Heading2>내게 가장 알맞은 구성을 선택할 수 있어요!</Heading2>

      <div className="mw-1000 flex items-center justify-center gap-3">
        <PricePlanCard
          paragraphStyle={paragraphStyle}
          title={basicePriceInfo?.title ?? ''}
          description={basicePriceInfo?.description ?? ''}
          originalPrice={basicRegularPrice}
          discountAmount={basicDiscountAmount}
        />
        <PricePlanCard
          paragraphStyle={paragraphStyle}
          title={standardPriceInfo?.title ?? ''}
          description={standardPriceInfo?.description ?? ''}
          originalPrice={standardRegularPrice}
          discountAmount={standardDiscountAmount}
        />
        <PricePlanCard
          paragraphStyle={paragraphStyle}
          title={premiumPriceInfo?.title ?? ''}
          description={premiumPriceInfo?.description ?? ''}
          originalPrice={premiumRegularPrice}
          discountAmount={premiumDiscountAmount}
        />
      </div>
    </section>
  );
}

export default ChallengePricePlanSection;
