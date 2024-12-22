import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { memo, ReactNode, useMemo, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';

import {
  convertReportTypeToDisplayName,
  convertReportTypeToPathname,
  ReportPriceDetail,
  ReportType,
} from '@/api/report';
import CheckIcon from '@/assets/icons/chevron-down.svg?react';
import { twMerge } from '@/lib/twMerge';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
import MainHeader from './MainHeader';
import SectionHeader from './SectionHeader';
import SubHeader from './SubHeader';

const SECTION_HEADER = '가격 및 플랜';
const SUB_HEADER = '자신있게 추천합니다!';
const MAIN_HEADER = '취업 성공을 위한\n맞춤형 피드백 플랜, 그리고 옵션까지';

interface ReportPlanSectionProps {
  priceDetail: ReportPriceDetail;
  reportType: ReportType;
}

const ReportPlanSection = ({
  priceDetail,
  reportType,
}: ReportPlanSectionProps) => {
  const SUB_HEADER_STYLE = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._171918,
  };

  const basicPlan = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return [
          '자소서 문항 1개에 대해 피드백 제공',
          '각 문항당 1,000자 제한',
          '자소서 문항 추가는 옵션에서 선택 가능',
        ];

      default:
        return [
          '이력서 작성 고민을 해결하는 맞춤형 솔루션 제공',
          '총 6가지 기준을 바탕으로 이력서 형식 및 내용 피드백',
          '희망 직무/산업에 맞춘 합격자 예시 자료 제공',
        ];
    }
  }, [reportType]);

  const premiumPlan = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return [
          '최대 4문항, 총 글자수 4,000자 미만 제한',
          '자소서 전체에 대한',
          '자소서 문항 추가는 옵션에서 선택 가능',
        ];

      default:
        return [
          '베이직 리포트 + 채용 공고 맞춤 직무 역량 및 태도 분석',
          '지원 공고 핵심 요구사항 맞춤 피드백 2페이지 추가',
          '공고별 적합 표현과 키워드로 합격 가능성 극대화',
        ];
    }
  }, [reportType]);

  const employees = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return ['컨설팅펌 현직자', '삼성계열사 현직자'];

      default:
        return [
          '컨설팅펌 현직자',
          '삼성/SK 현직자',
          '금융권 현직자',
          '스타트업 마케팅 현직자',
        ];
    }
  }, [reportType]);

  const employeeFeedbackContent =
    reportType === 'PERSONAL_STATEMENT'
      ? '현직자의 서류 피드백 & 서류 작성 꿀팁'
      : '현직자가 제공하는 심층 서류 피드백 및 작성 노하우';

  const feedback = useMemo(() => {
    switch (reportType) {
      case 'PERSONAL_STATEMENT':
        return [
          '발급된 진단서를 바탕으로 온라인 미팅 진행',
          '커리어 전문가와 맞춤형 서류 완성',
          '이력서와 관련된 모든 궁금증을 마음껏 해결하세요',
        ];
      default:
        return [
          '40분간의 심층 상담으로 나만의 강점과 경쟁력 발굴',
          '지원 직무에switch(reportType) 최적화된 실질적·구체적 개선 방향 제시',
          '맞춤 전략으로 서류 경쟁력 강화 및 합격 가능성 극대화',
          '이력서와 관련된 모든 궁금증을 마음껏 해결하세요',
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
    <section className="w-full bg-neutral-90 px-5 py-16 md:pb-36 md:pt-28">
      <header>
        <SectionHeader className="mb-6">{SECTION_HEADER}</SectionHeader>
        <SubHeader className="mb-1 md:mb-3" style={SUB_HEADER_STYLE}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>

      <main className="mt-9 flex max-w-[832px] flex-col gap-4 md:mt-5 md:gap-5 lg:mx-auto lg:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:gap-3">
          {/* 베이직 플랜 */}
          <PriceCard className="md:flex md:flex-col md:justify-between">
            <div>
              <Dropdown
                title="베이직 플랜"
                initialOpenState={isMobile ? false : true}
                showToggle={isMobile ? true : false}
              >
                <div className="flex flex-col gap-3">
                  {basicPlan.map((item, index) => (
                    <CheckListItem key={index}>{item}</CheckListItem>
                  ))}
                </div>
              </Dropdown>
              <hr className="mb-5 mt-4 md:my-6" />
            </div>

            <PriceSection
              originalPrice={basicPriceInfo?.price ?? 0}
              discountPrice={basicPriceInfo?.discountPrice ?? 0}
            />
          </PriceCard>

          {/* 프리미엄 플랜 */}
          <PriceCard
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
            isFloatingBanner={isMobile ? false : true}
            floatingBannerClassName="left-36 top-4"
          >
            <Dropdown
              title="프리미엄 플랜"
              initialOpenState={isMobile ? false : true}
              showToggle={isMobile ? true : false}
            >
              <div className="flex flex-col gap-3">
                {premiumPlan.map((item, index) => (
                  <CheckListItem
                    key={index}
                    // 첫 줄만 bold
                    className={index === 0 ? 'font-bold' : ''}
                  >
                    {item}
                    {/* 예외 문항 */}
                    {reportType === 'PERSONAL_STATEMENT' && index === 1 && (
                      <span className="font-bold"> ‘총평 페이지’ 추가</span>
                    )}
                  </CheckListItem>
                ))}
              </div>
            </Dropdown>
            <hr className="mb-5 mt-4 md:my-6" />
            <PriceSection
              originalPrice={premiumPriceInfo?.price ?? 0}
              discountPrice={premiumPriceInfo?.discountPrice ?? 0}
            />
          </PriceCard>
        </div>

        <div className="border-t-2 border-dashed border-neutral-70" />

        {/* 옵션 */}
        {optionInfos && optionInfos.length > 0 && (
          <PriceCard>
            <CardSubHeader>옵션</CardSubHeader>
            <CardMainHeader>현직자 피드백</CardMainHeader>
            <CheckListItem>{employeeFeedbackContent}</CheckListItem>
            <div className="mb-1 mt-3 flex flex-col gap-1.5 md:grid md:grid-cols-2 md:gap-2">
              {employees.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xs bg-[#EEFAFF] py-2 text-center text-xxsmall12 font-semibold md:text-xsmall14"
                >
                  {item}
                </div>
              ))}
            </div>
            <span className="mb-4 inline-block text-xxsmall12 text-neutral-35 md:text-xsmall14">
              *피드백 받고 싶은 현직자 여러명 옵션 추가 가능
            </span>

            <div className="md:flex md:items-end md:gap-1">
              {/* 첫 번째 옵션 가격 표시 */}
              <PriceSection
                originalPrice={optionInfos[0].price ?? 0}
                discountPrice={optionInfos[0].discountPrice ?? 0}
              />
              <span className="text-xxsmall12 font-medium text-neutral-45 md:text-xsmall16">
                현직자 택 1인 옵션 추가 금액
              </span>
            </div>
          </PriceCard>
        )}

        {/* 1:1 피드백 */}
        <PriceCard
          reportType={reportType}
          bannerText="저렴한 가격으로 무한 질문&심층 피드백을 받고 싶다면, "
          bannerColor={
            reportType === 'PERSONAL_STATEMENT'
              ? personalStatementColors.CA60FF
              : resumeColors._2CE282
          }
          bannerClassName={clsx({
            'text-white': reportType === 'PERSONAL_STATEMENT',
          })}
          isFloatingBanner={isMobile ? false : true}
          floatingBannerClassName="left-[4.5rem] top-8"
        >
          <CardSubHeader>옵션</CardSubHeader>
          <CardMainHeader>1:1 피드백</CardMainHeader>
          <div className="mb-4 flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3">
            {feedback.map((item, index) => (
              <CheckListItem key={index}>
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
              </CheckListItem>
            ))}
          </div>

          <PriceSection
            originalPrice={feedbackInfo?.feedbackPrice ?? 0}
            discountPrice={feedbackInfo?.feedbackDiscountPrice ?? 0}
          />
        </PriceCard>
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
  isFloatingBanner = false,
  floatingBannerClassName,
}: {
  reportType?: ReportType;
  bannerText?: string;
  bannerColor?: string;
  bannerClassName?: string;
  children?: ReactNode;
  className?: string;
  isFloatingBanner?: boolean;
  floatingBannerClassName?: string;
}) {
  const BANNER_STYLE = {
    backgroundColor: bannerColor,
  };

  return (
    <div className="relative w-full overflow-hidden rounded-md">
      {/* Banner */}
      {bannerText && !isFloatingBanner && (
        <div
          style={BANNER_STYLE}
          className={twMerge(
            'bg-primary py-1 text-center text-xsmall14 font-semibold',
            bannerClassName,
          )}
        >
          {bannerText}
        </div>
      )}
      {bannerText && isFloatingBanner && (
        <div className={twMerge('absolute', floatingBannerClassName)}>
          <div
            style={BANNER_STYLE}
            className={twMerge(
              'rounded-md bg-primary px-3 py-1 text-center text-xsmall14 font-semibold',
              bannerClassName,
            )}
          >
            {bannerText}
          </div>
          <img
            className="h-auto w-auto translate-x-12"
            src={`/icons/report-bubble-tail-${convertReportTypeToPathname(reportType)}.svg`}
            alt="bubble tail"
          />
        </div>
      )}
      <div
        className={twMerge(
          'h-full bg-white px-5 py-6 md:px-6 md:py-8',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
});

const Dropdown = memo(function Dropdown({
  title,
  children,
  initialOpenState = true,
  showToggle = true,
}: {
  title: string;
  children?: ReactNode;
  initialOpenState?: boolean;
  showToggle?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(initialOpenState);

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-between rounded-md bg-black px-5 py-3 text-xsmall16 font-semibold text-white md:py-4 md:text-small20',
          { 'cursor-pointer': showToggle },
        )}
        onClick={() => showToggle && setIsOpen(!isOpen)}
      >
        {title}
        {showToggle && (
          <>
            {isOpen ? (
              <HiChevronUp size={24} color="#7A7D84" />
            ) : (
              <HiChevronDown size={24} color="#7A7D84" />
            )}
          </>
        )}
      </div>
      {isOpen && (
        <div className="mt-4 bg-neutral-95 px-4 py-5 md:mt-6">{children}</div>
      )}
    </>
  );
});

const CheckListItem = memo(function CheckListItem({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-0.5">
      <CheckIcon
        className="h-auto w-6 -translate-y-0.5 md:translate-y-0"
        color="#27272D"
      />
      <span
        className={twMerge(
          'whitespace-pre-line text-xsmall14 font-medium text-neutral-0 md:text-small18',
          className,
        )}
      >
        {children}
      </span>
    </div>
  );
});

const PriceSection = memo(function PriceSection({
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
        <span className="text-small20 font-bold text-[#FC5555] md:text-xsmall16">
          {discountRate}%
        </span>
        <s className="text-small20 font-bold text-neutral-45 md:text-xsmall16">
          {originalPrice.toLocaleString()}원
        </s>
      </div>
      <span className="text-xlarge28 font-bold md:text-medium24">
        {finalPrice.toLocaleString()}원
      </span>
    </div>
  );
});

const CardSubHeader = memo(function CardSubHeader({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <span className="text-xsmall16 font-medium text-neutral-45 md:text-small18">
      {children}
    </span>
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
