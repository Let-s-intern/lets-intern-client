import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { CSSProperties, memo, ReactNode, useMemo } from 'react';

import {
  convertReportTypeToDisplayName,
  convertReportTypeToPathname,
  ReportPriceDetail,
  ReportType,
} from '@/api/report';
import { twMerge } from '@/lib/twMerge';
import { REPORT_PLAN_ID } from '@/pages/common/report/ReportNavigation';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
import MainHeader from './MainHeader';
import SectionHeader from './SectionHeader';
import SubHeader from './SubHeader';

const SECTION_HEADER = '가격 및 플랜';
const SUB_HEADER = '합리적인 가격 구성';
const MAIN_HEADER = '취업 성공을 위한\n맞춤형 피드백 플랜';
const OPTION_HEADER = '더 깊이 있는 피드백을 원한다면,\n옵션 추가도 가능해요!';

interface ReportPlanSectionProps {
  priceDetail: ReportPriceDetail;
  reportType: ReportType;
}

const ReportPlanSection = ({
  priceDetail,
  reportType,
}: ReportPlanSectionProps) => {
  const subHeaderStyle = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const numberStyle = {
    backgroundColor:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.CA60FF
        : resumeColors._2CE282,
  };

  const basicPlan = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return [
          '자소서 1문항 피드백 제공',
          '서류 작성 고민 상담 및 솔루션',
          '직무/산업별 합격자 예시 자료 제공',
        ];

      default:
        return [
          '6가지 핵심 기준 기반 이력서 진단 및 피드백',
          '서류 작성 고민 상담 및 솔루션',
          '직무/산업별 합격자 예시 자료 제공',
        ];
    }
  }, [reportType]);

  const premiumPlan = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return [
          '자소서 4문항 피드백 제공',
          '서류 작성 고민 상담 및 솔루션',
          '직무/산업별 합격자 예시 자료 제공',
          '자소서 완성도를 높이는 ‘전체 총평 페이지’ 제공',
          '문항별 연관성을 바탕으로 직무 적합성을 강화할 키워드 제안',
        ];

      default:
        return [
          '6가지 핵심 기준 기반 이력서 진단 및 피드백',
          '서류 작성 고민 상담 및 솔루션',
          '직무/산업별 합격자 예시 자료 제공',
          '채용공고 기반 직무 역량 분석 및 맞춤 피드백 제공',
          '공고 요구사항 반영 여부 및 적합 키워드 제안',
        ];
    }
  }, [reportType]);

  const employees = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return ['삼성계열사 현직자', '컨설팅펌 현직자'];

      default:
        return ['컨설팅펌', '삼성/SK ', '금융권 ', '스타트업 마케팅 '];
    }
  }, [reportType]);

  const feedback = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return [
          '40분동안 무한 질문 가능!',
          '실시간 자소서 첨삭',
          '자소서부터 취업 전략까지 한 번에 해결',
        ];
      default:
        return [
          '40분동안 무한 질문 가능!',
          '실시간 이력서 첨삭',
          '이력서부터 취업 전략까지 한 번에 해결',
        ];
    }
  }, [reportType]);

  const basicPriceInfo = priceDetail.reportPriceInfos?.find(
    (info) => info.reportPriceType === 'BASIC',
  );
  const premiumPriceInfo = priceDetail.reportPriceInfos?.find(
    (info) => info.reportPriceType === 'PREMIUM',
  );
  const optionInfos = priceDetail.reportOptionInfos;
  const feedbackInfo = priceDetail.feedbackPriceInfo;

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <section
      id={REPORT_PLAN_ID}
      className="w-full bg-neutral-90 px-5 py-16 md:pb-36 md:pt-28"
    >
      <header>
        <SectionHeader className="mb-6">{SECTION_HEADER}</SectionHeader>
        <SubHeader className="mb-1 md:mb-3" style={subHeaderStyle}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>

      <main className="mt-10 max-w-[832px] md:mt-12 lg:mx-auto lg:px-0">
        {/* 좌우 슬라이드 */}
        <div
          data-section="price-1"
          className="custom-scrollbar -mx-5 mb-14 overflow-x-auto px-5 lg:mx-0 lg:px-0"
        >
          <div className="flex w-fit gap-3">
            {/* 프리미엄 플랜 */}
            <PriceCard
              className="flex min-w-[18rem] flex-col gap-3 md:gap-5"
              reportType={reportType}
              bannerText={`채용 공고 맞춤형 ${convertReportTypeToDisplayName(reportType)}를 원한다면,`}
              bannerColor={
                reportType === 'PERSONAL_STATEMENT'
                  ? personalStatementColors.CA60FF
                  : resumeColors._2CE282
              }
              bannerClassName={clsx({
                'text-white': reportType === 'PERSONAL_STATEMENT',
              })}
              showBubbleTail={isMobile ? false : true}
              floatingBannerClassName="left-5 top-0 md:left-36 md:top-4"
            >
              <PlanCard title="프리미엄 플랜">
                <div className="flex flex-col gap-3">
                  {premiumPlan.map((item, index) => (
                    <NumberedListItem
                      key={index}
                      number={index + 1}
                      numberStyle={index >= 3 ? numberStyle : {}}
                      numberClassName={clsx({
                        'text-black': reportType === 'RESUME' && index >= 3,
                      })}
                    >
                      {/* 예외 문항 */}
                      {reportType === 'PERSONAL_STATEMENT' && index === 0 && (
                        <s className="block">자소서 1문항 피드백 제공</s>
                      )}
                      {item}
                    </NumberedListItem>
                  ))}
                </div>
              </PlanCard>
              <PriceSection
                originalPrice={premiumPriceInfo?.price ?? 0}
                discountPrice={premiumPriceInfo?.discountPrice ?? 0}
              />
            </PriceCard>

            {/* 베이직 플랜 */}
            <PriceCard className="flex min-w-[18rem] flex-col justify-between">
              <PlanCard title="베이직 플랜">
                <div className="flex flex-col gap-3">
                  {basicPlan.map((item, index) => (
                    <NumberedListItem key={index} number={index + 1}>
                      {item}
                    </NumberedListItem>
                  ))}
                </div>
              </PlanCard>
              <PriceSection
                originalPrice={basicPriceInfo?.price ?? 0}
                discountPrice={basicPriceInfo?.discountPrice ?? 0}
              />
            </PriceCard>
          </div>
        </div>

        <MainHeader>{OPTION_HEADER}</MainHeader>
        <div data-section="price-2" className="mt-4 flex flex-col gap-5">
          {/* 옵션 */}
          {optionInfos && optionInfos.length > 0 && (
            <PriceCard>
              <Badge className="mb-1">선택 옵션 1</Badge>
              <CardMainHeader>현직자 서면 피드백</CardMainHeader>
              <p className="mb-2 mt-1 text-xsmall14 font-medium text-neutral-0">
                현직자가 제공하는 심층 서류 피드백 및 작성 노하우
              </p>
              <p className="mb-1.5 text-xxsmall12 text-neutral-35 md:text-xsmall14">
                *피드백 받고 싶은 현직자 여러명 옵션 추가 가능
              </p>
              <div className="mb-5 mt-3 grid grid-cols-2 gap-x-1.5 gap-y-2">
                {employees.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xs bg-[#EEFAFF] py-2 text-center text-xxsmall12 font-semibold md:text-xsmall14"
                  >
                    {item + (isMobile ? '' : ' 현직자')}
                  </div>
                ))}
              </div>
              <div className="md:flex md:items-end md:gap-1">
                <span className="text-xxsmall12 font-medium text-neutral-45 md:text-xsmall16">
                  현직자 택 1인 옵션 추가 금액
                </span>
                {/* 첫 번째 옵션 가격 표시 */}
                <PriceSection
                  originalPrice={optionInfos[0].price ?? 0}
                  discountPrice={optionInfos[0].discountPrice ?? 0}
                />
              </div>
            </PriceCard>
          )}

          {/* 1:1 피드백 */}
          <PriceCard
            reportType={reportType}
            bannerText="무한 질문 & 심층 피드백을 받고 싶다면,"
            bannerColor={
              reportType === 'PERSONAL_STATEMENT'
                ? personalStatementColors.CA60FF
                : resumeColors._2CE282
            }
            bannerClassName={clsx({
              'text-white': reportType === 'PERSONAL_STATEMENT',
            })}
            showBubbleTail={isMobile ? false : true}
            floatingBannerClassName=" left-5 -top-1 md:left-[4.5rem] md:top-8"
          >
            <Badge className="mb-1">선택 옵션 2</Badge>
            <CardMainHeader>
              무제한 질문으로 고민 해결,
              <br />
              1:1 온라인 상담
            </CardMainHeader>
            <div className="mb-4 flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3">
              {feedback.map((item, index) => (
                <NumberedListItem key={index}>
                  {/* 예외 문항 */}
                  {index === feedback.length - 1 && (
                    <>
                      <span className="font-bold">
                        &quot;무한 질문&quot; 가능!
                      </span>
                      <br />
                    </>
                  )}
                  {item}
                </NumberedListItem>
              ))}
            </div>

            <PriceSection
              originalPrice={feedbackInfo?.feedbackPrice ?? 0}
              discountPrice={feedbackInfo?.feedbackDiscountPrice ?? 0}
            />
          </PriceCard>
        </div>
      </main>
    </section>
  );
};

export default ReportPlanSection;

const PriceCard = memo(function PriceCard({
  bannerText,
  bannerColor,
  bannerClassName,
  children,
  reportType = 'RESUME',
  className,
  showBubbleTail = false,
  floatingBannerClassName,
}: {
  reportType?: ReportType;
  bannerText?: string;
  bannerColor?: string;
  bannerClassName?: string;
  children?: ReactNode;
  className?: string;
  showBubbleTail?: boolean;
  floatingBannerClassName?: string;
}) {
  const BANNER_STYLE = {
    backgroundColor: bannerColor,
  };

  return (
    <div className="relative w-full">
      {bannerText && (
        <div className={twMerge('absolute', floatingBannerClassName)}>
          <div
            style={BANNER_STYLE}
            className={twMerge(
              'rounded-xs bg-primary px-3 py-1 text-center text-xxsmall12 font-medium md:rounded-md md:text-xsmall14 md:font-semibold',
              bannerClassName,
            )}
          >
            {bannerText}
          </div>
          {showBubbleTail && (
            <img
              className="h-auto w-auto translate-x-12"
              src={`/icons/report-bubble-tail-${convertReportTypeToPathname(reportType)}.svg`}
              alt="bubble tail"
            />
          )}
        </div>
      )}
      <div
        className={twMerge(
          'h-full rounded-md bg-white px-5 py-6 md:px-6 md:py-8',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
});

const PlanCard = memo(function PlanCard({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between rounded-md bg-black px-5 py-3 text-xsmall16 font-semibold text-white md:py-4 md:text-small20">
        {title}
      </div>
      <div className="mt-2 h-[14rem] rounded-xs bg-neutral-95 p-3 pr-4 md:mt-4 md:h-[19rem] md:px-6 md:py-5">
        {children}
      </div>
    </div>
  );
});

const NumberedListItem = memo(function NumberedListItem({
  children,
  childrenClassName,
  number = 1,
  numberClassName,
  numberStyle,
}: {
  children?: ReactNode;
  childrenClassName?: string;
  number?: number;
  numberClassName?: string;
  numberStyle?: CSSProperties;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <div
        style={numberStyle}
        className={twMerge(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-60 text-xxsmall12 font-medium text-white md:h-6 md:w-6 md:text-small18',
          numberClassName,
        )}
      >
        {number}
      </div>

      <span
        className={twMerge(
          'whitespace-pre-line text-xsmall14 font-medium text-neutral-0 md:text-small18',
          childrenClassName,
        )}
      >
        {children}
      </span>
    </div>
  );
});

const PriceSection = memo(function PriceSection({
  wrapperClassName,
  originalPrice,
  discountPrice,
}: {
  wrapperClassName?: string;
  originalPrice: number;
  discountPrice: number;
}) {
  const finalPrice = originalPrice - discountPrice;
  const discountRate = ((finalPrice / originalPrice) * 100).toFixed(0);

  return (
    <div className={wrapperClassName}>
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
});

const CardMainHeader = memo(function CardMainHeader({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <span className="mb-2 mt-0.5 block text-xsmall16 font-semibold md:mb-3 md:mt-2 md:text-small20">
      {children}
    </span>
  );
});

const Badge = memo(function Badge({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'w-fit rounded-xxs bg-neutral-35 px-2 py-1 text-xxsmall12 font-semibold text-white',
        className,
      )}
    >
      {children}
    </div>
  );
});
