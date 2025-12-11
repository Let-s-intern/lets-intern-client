import { ChallengePriceInfo } from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import SectionHeader from '@components/ui/SectionHeader';
import SectionSubHeader from '@components/ui/SectionSubHeader';
import * as React from 'react';
import PriceSummary from '../../../components/common/ui/PriceSummary';
import MainTitle from '../ui/MainTitle';

const PriceBox = ({
  title,
  children,
  label,
  originalPrice,
  discountAmount,
}: {
  title: string;
  children: React.ReactNode;
  label: string;
  originalPrice: number;
  discountAmount: number;
}) => {
  return (
    <div className="relative flex flex-1 flex-col gap-6 rounded-sm bg-white px-5 py-7">
      <div className="absolute right-3 top-0 rounded-b-xxs bg-[#4A76FF] px-2.5 py-1.5 text-xsmall16 font-medium text-white">
        {label}
      </div>
      <span className="text-small20 font-bold">{title}</span>
      <div className="flex h-full flex-col gap-6 md:justify-between">
        <p className="whitespace-pre-line text-small18 font-medium text-neutral-0 md:mb-7 md:min-h-[78px]">
          {children}
        </p>
        <PriceSummary
          originalPrice={originalPrice}
          discountPrice={discountAmount}
        />
      </div>
    </div>
  );
};

interface Props {
  priceInfoList: ChallengePriceInfo[];
}

const MarketingPricingSection = ({ priceInfoList }: Props) => {
  const basicPriceInfo = priceInfoList.find(
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
  } = getChallengeOptionPriceInfo(priceInfoList);

  const pricingList = [
    {
      title: basicPriceInfo?.title || '기본',
      label: '대학생 추천',
      description: basicPriceInfo?.description ?? '',
      originalPrice: basicRegularPrice,
      discountAmount: basicDiscountAmount,
    },
    {
      title: standardPriceInfo?.title || '스탠다드',
      label: '취준 0~6개월 추천',
      description: standardPriceInfo?.description ?? '',
      originalPrice: standardRegularPrice,
      discountAmount: standardDiscountAmount,
    },
    {
      title: premiumPriceInfo?.title || '프리미엄',
      label: '취준 6개월~2년 추천',
      description: premiumPriceInfo?.description ?? '',
      originalPrice: premiumRegularPrice,
      discountAmount: premiumDiscountAmount,
    },
  ];

  return (
    <section
      id="pricing"
      className="flex scroll-mt-[56px] flex-col items-center bg-neutral-90 px-5 py-[70px] md:scroll-mt-[60px] md:px-0 md:pb-[140px] md:pt-[100px]"
    >
      <SectionHeader className="mb-6 md:mb-[60px]">가격 플랜</SectionHeader>
      <div className="mb-[30px] flex flex-col items-center gap-2 md:mb-[50px] md:gap-3">
        <SectionSubHeader className="text-[#4A76FF]">
          취준 비용 부담은 낮추고, 퀄리티는 높이고
        </SectionSubHeader>
        <MainTitle>
          내게 가장 알맞은 구성을
          <br className="md:hidden" /> 선택할 수 있어요!
        </MainTitle>
      </div>

      <div className="flex w-full max-w-[1000px] flex-col items-stretch gap-3 px-3 max-md:max-w-full md:flex-row md:px-0">
        {pricingList.map((item) =>
          // 해당 플랜이 없으면 null 반환
          item.originalPrice === 0 ? null : (
            <PriceBox
              key={item.title}
              title={item.title}
              label={item.label}
              originalPrice={item.originalPrice}
              discountAmount={item.discountAmount}
            >
              {item.description}
            </PriceBox>
          ),
        )}
      </div>
    </section>
  );
};

export default MarketingPricingSection;
