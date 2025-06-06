import { ChallengePriceInfo } from '@/schema';
import getChallengeOptionPriceInfo from '@/utils/getChallengeOptionPriceInfo';
import SectionHeader from '@components/ui/SectionHeader';
import SectionSubHeader from '@components/ui/SectionSubHeader';
import * as React from 'react';
import PriceSummary from '../ui/PriceSummary';
import MainTitle from './MainTitle';

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
      <p className="text-small18 font-medium text-neutral-0 md:mb-7 md:h-[78px]">
        {children}
      </p>
      <PriceSummary
        originalPrice={originalPrice}
        discountPrice={discountAmount}
      />
    </div>
  );
};

interface Props {
  priceInfoList: ChallengePriceInfo[];
}

const MarketingPricingSection = ({ priceInfoList }: Props) => {
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
      title: '기본',
      label: '대학생 추천',
      description: (
        <>이력서, 자기소개서, 포트폴리오 완성 현직자 LIVE 클래스 8종</>
      ),
      originalPrice: basicRegularPrice,
      discountAmount: basicDiscountAmount,
    },
    {
      title: '프리미엄',
      label: '취준 0~6개월 추천',
      description: (
        <>
          이력서, 자기소개서, 포트폴리오 완성 현직자 LIVE 클래스 8종
          <br />
          <strong className="font-bold">서류 1종 피드백</strong>
        </>
      ),
      originalPrice: standardRegularPrice,
      discountAmount: standardDiscountAmount,
    },
    {
      title: 'All In One',
      label: '취준 6개월~2년 추천',
      description: (
        <>
          이력서, 자기소개서, 포트폴리오 완성 현직자 LIVE 클래스 8종 <br />
          <strong className="font-bold">
            서류 1종 피드백 + 경험정리 피드백
          </strong>
        </>
      ),
      originalPrice: premiumRegularPrice,
      discountAmount: premiumDiscountAmount,
    },
  ];

  return (
    <div className="flex flex-col items-center bg-neutral-90 px-5 py-[70px] md:px-0 md:pb-[140px] md:pt-[100px]">
      <SectionHeader className="mb-6 md:mb-[60px]">가격 구성</SectionHeader>
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
        {pricingList.map((item) => (
          <PriceBox
            key={item.title}
            title={item.title}
            label={item.label}
            originalPrice={item.originalPrice}
            discountAmount={item.discountAmount}
          >
            {item.description}
          </PriceBox>
        ))}
      </div>
    </div>
  );
};

export default MarketingPricingSection;
