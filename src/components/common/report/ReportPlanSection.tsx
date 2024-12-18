import { ReactNode, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';

import { ReportColors } from '@/types/interface';
import { useMediaQuery } from '@mui/material';
import MainHeader from './MainHeader';
import SectionHeader from './SectionHeader';
import SubHeader from './SubHeader';

import { ReportPriceDetail } from '@/api/report';
import CheckIcon from '@/assets/icons/chevron-down.svg?react';
import { twMerge } from '@/lib/twMerge';

const SECTION_HEADER = '가격 및 플랜';
const SUB_HEADER = '자신있게 추천합니다!';
const MAIN_HEADER = '취업 성공을 위한\n맞춤형 피드백 플랜, 그리고 옵션까지';

const basicPlan = [
  '이력서 작성 고민을 해결하는 맞춤형 솔루션 제공',
  '총 6가지 기준을 바탕으로 이력서 형식 및 내용 피드백',
  '희망 직무/산업에 맞춘 합격자 예시 자료 제공',
];

const premiumPlan = [
  '베이직 리포트 + 채용 공고 맞춤 직무 역량 및 태도 분석',
  '지원 공고 핵심 요구사항 맞춤 피드백 2페이지 추가',
  '공고별 적합 표현과 키워드로 합격 가능성 극대화',
];

interface ReportPlanSectionProps {
  colors: ReportColors;
  priceDetail: ReportPriceDetail;
}

const ReportPlanSection = ({ colors, priceDetail }: ReportPlanSectionProps) => {
  const SUB_HEADER_STYLE = {
    color: colors.primary.DEFAULT,
  };

  const basicPriceInfo = priceDetail.reportPriceInfos?.find(
    (info) => info.reportPriceType === 'BASIC',
  );
  const premiumPriceInfo = priceDetail.reportPriceInfos?.find(
    (info) => info.reportPriceType === 'PREMIUM',
  );

  console.log('가격 정보:', priceDetail);

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section className="w-full bg-neutral-90 px-5 py-16 md:py-24">
      <header>
        <SectionHeader className="mb-6">{SECTION_HEADER}</SectionHeader>
        <SubHeader className="mb-1 md:mb-3" style={SUB_HEADER_STYLE}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>

      <main className="mt-9 flex flex-col gap-4">
        {/* 베이직 플랜 */}
        <PlanBox>
          <DropDown
            title="베이직 플랜"
            initialOpenState={isMobile ? false : true}
          >
            <div className="flex flex-col gap-3">
              {basicPlan.map((item, index) => (
                <CheckListItem key={index} content={item} />
              ))}
            </div>
          </DropDown>
          <hr className="mb-5 mt-4" />
          <PriceSection
            originalPrice={basicPriceInfo?.price ?? 0}
            discountPrice={basicPriceInfo?.discountPrice ?? 0}
          />
        </PlanBox>

        <PlanBox
          bannerText="채용 공고 맞춤형 이력서를 원한다면,"
          bannerColor={colors.primary[400]}
        >
          <DropDown
            title="프리미엄 플랜"
            initialOpenState={isMobile ? false : true}
          >
            <div className="flex flex-col gap-3">
              {premiumPlan.map((item, index) => (
                <CheckListItem
                  key={index}
                  content={item}
                  className={index === 0 ? 'font-bold' : ''}
                />
              ))}
            </div>
          </DropDown>
          <hr className="mb-5 mt-4" />
          <PriceSection
            originalPrice={premiumPriceInfo?.price ?? 0}
            discountPrice={premiumPriceInfo?.discountPrice ?? 0}
          />
        </PlanBox>
      </main>
    </section>
  );
};

export default ReportPlanSection;

function PlanBox({
  bannerText,
  bannerColor,
  children,
}: {
  bannerText?: string;
  bannerColor?: string;
  children?: ReactNode;
}) {
  const BANNER_STYLE = {
    backgroundColor: bannerColor,
  };

  return (
    <div className="overflow-hidden rounded-md">
      {/* Banner */}
      {bannerText && (
        <div
          style={BANNER_STYLE}
          className="bg-primary py-1 text-center text-xsmall14 font-semibold"
        >
          {bannerText}
        </div>
      )}
      <div className="bg-white px-5 py-6">{children}</div>
    </div>
  );
}

function DropDown({
  title,
  children,
  initialOpenState = true,
}: {
  title: string;
  children?: ReactNode;
  initialOpenState?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(initialOpenState);

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between rounded-md bg-black px-5 py-3 text-xsmall16 font-semibold text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? (
          <HiChevronUp size={24} color="#7A7D84" />
        ) : (
          <HiChevronDown size={24} color="#7A7D84" />
        )}
      </div>
      {isOpen && (
        <div className="mt-4 rounded-md bg-neutral-95 px-4 py-5">
          {children}
        </div>
      )}
    </>
  );
}

function CheckListItem({
  content,
  className,
}: {
  content?: string;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-0.5">
      <CheckIcon className="h-auto w-6" color="#27272D" />
      <span
        className={twMerge(
          'text-xsmall14 font-medium text-neutral-0',
          className,
        )}
      >
        {content}
      </span>
    </div>
  );
}

function PriceSection({
  originalPrice,
  discountPrice,
}: {
  originalPrice: number;
  discountPrice: number;
}) {
  const finalPrice = originalPrice - discountPrice;
  const discountRate = ((finalPrice / originalPrice) * 100).toFixed(0);

  return (
    <div>
      <div className="flex items-center gap-1">
        <span className="text-small20 font-bold text-[#FC5555]">
          {discountRate}%
        </span>
        <s className="text-small20 font-bold text-neutral-45">
          {originalPrice.toLocaleString()}원
        </s>
      </div>
      <span className="text-xlarge28 font-bold">
        {finalPrice.toLocaleString()}원
      </span>
    </div>
  );
}
