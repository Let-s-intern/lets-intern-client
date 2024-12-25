import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import BubbleTail from '@/assets/icons/bubble-tail.svg?react';
import UnderLine from '@/assets/icons/double-underline.svg?react';
import GradientArrow from '@/assets/icons/gradient-arrow.svg?react';
import NextButton from '@/assets/icons/next-button.svg?react';
import Pencil from '@/assets/icons/pencil.svg?react';
import PrevButton from '@/assets/icons/prev-button.svg?react';
import Profile from '@/assets/icons/profile.svg?react';
import { REPORT_EXAMPLE } from '@/data/reportConstant';
import { REPORT_EXAMPLE_ID } from '@/pages/common/report/ReportNavigation';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
import { ReportExample } from '@/types/interface';
import { ReactNode, useRef } from 'react';
import ReportExampleCard from './ReportExampleCard';

interface ReportExampleSectionProps {
  type: ReportType;
  reportExample?: ReportExample | null;
}

const ReportExampleStep = ({
  order,
  color,
  children,
}: {
  order: number;
  children: ReactNode;
  color: string;
}) => {
  return (
    <div className="flex w-full items-center gap-x-2 font-medium text-neutral-0">
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xxsmall12 md:text-xsmall14"
        style={{ backgroundColor: color }}
      >
        {order}
      </span>
      <span className="text-xsmall14 md:text-small20">{children}</span>
    </div>
  );
};

const ReportExampleSection = ({
  type,
  reportExample,
}: ReportExampleSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const subHeaderStyle = {
    color:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const cardStyle = {
    backgroundColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.F9EEFF
        : resumeColors.E8FDF2,
  };
  const baseColor =
    type === 'PERSONAL_STATEMENT'
      ? personalStatementColors.CA60FF
      : resumeColors._2CE282;

  const example = REPORT_EXAMPLE[type];
  // scrollRef의 첫 번째 child의 width를 가져옴
  const scrollWidth = scrollRef.current?.firstElementChild?.clientWidth ?? 0;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const scrollMax =
      scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    const scrollAmount = scrollWidth + 12;

    if (direction === 'left') {
      scrollRef.current.scrollLeft = Math.max(scrollLeft - scrollAmount, 0);
    } else {
      scrollRef.current.scrollLeft = Math.min(
        scrollLeft + scrollAmount,
        scrollMax,
      );
    }
  };

  if (!reportExample) return null;

  return (
    <section
      id={REPORT_EXAMPLE_ID}
      data-section="sample"
      className="flex w-full flex-col items-center"
    >
      <div className="flex w-full flex-col">
        <div className="flex flex-col items-center bg-black px-5 pb-10 pt-[70px] md:pb-[60px] md:pt-[100px] lg:px-0">
          <div className="flex w-full max-w-[1000px] flex-col items-center gap-y-[30px] md:gap-y-[60px]">
            <div className="flex w-full flex-col items-center gap-y-5 md:gap-y-[50px]">
              <h5 className="w-full text-center text-xsmall14 font-semibold text-neutral-45 md:text-small18">
                리포트 예시
              </h5>
              <div className="flex w-full flex-col items-center gap-y-2 md:gap-y-3">
                <h4
                  className="flex flex-col text-xsmall16 font-bold md:text-small20"
                  style={subHeaderStyle}
                >
                  하나하나 성의있고, 꼼꼼한 피드백
                </h4>
                <h3 className="whitespace-pre-wrap text-center text-medium22 font-bold text-white md:text-3xl">
                  48시간 이내 진단 후,
                  <br />
                  전달되는 피드백 REPORT에는
                  <br className="md:hidden" />
                  이런 내용이 들어갑니다.
                </h3>
              </div>
            </div>
            <div
              className="relative flex w-fit flex-col gap-y-2 rounded-md px-4 py-5 md:gap-y-3 md:px-6"
              style={cardStyle}
            >
              <ReportExampleStep order={1} color={baseColor}>
                핵심 기준을 바탕으로 진단한{' '}
                <span className="font-bold">총평 & 형식 피드백</span>
              </ReportExampleStep>
              <ReportExampleStep order={2} color={baseColor}>
                구체적인 첨삭 제안으로{' '}
                <span className="font-bold">명확한 개선 방향 제시</span>
              </ReportExampleStep>
              <ReportExampleStep order={3} color={baseColor}>
                구체성과 설득력을 높이는{' '}
                <span className="font-bold">
                  {convertReportTypeToDisplayName(type)} 맞춤형 피드백
                </span>
              </ReportExampleStep>
              <ReportExampleStep order={4} color={baseColor}>
                직무별 <span className="font-bold">합격자 사례 제공</span>
              </ReportExampleStep>
              <ReportExampleStep order={5} color={baseColor}>
                <span className="font-bold">채용공고 맞춤형 리포트</span>
                (*프리미엄 플랜)
              </ReportExampleStep>
              <ReportExampleStep order={6} color={baseColor}>
                <span className="font-bold">
                  채용공고 기반 {convertReportTypeToDisplayName(type)} 평가와
                  피드백
                </span>
                (*프리미엄 플랜)
              </ReportExampleStep>
              <ReportExampleStep order={7} color={baseColor}>
                {convertReportTypeToDisplayName(type)} 작성{' '}
                <span className="font-bold">고민에 대한 1:1 상담</span>
              </ReportExampleStep>
              <Pencil
                className="absolute inset-x-0 top-0 mx-auto h-auto w-14 -translate-y-1/2 transform md:left-auto md:right-0 md:top-1/2 md:w-24 md:translate-x-1/2"
                style={{ color: baseColor }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-neutral-0 p-5 text-small18 font-bold text-white md:py-[30px] lg:px-0">
          <div className="flex w-full max-w-[500px] flex-col items-center gap-y-2">
            <p className="relative break-keep text-center">
              실제 사례를 바탕으로 한 리포트 예시 보기
              <UnderLine
                className="absolute left-1/2 right-1/2 top-full h-auto w-[calc(100%+20px)] -translate-x-1/2 -translate-y-1/2 transform"
                style={{ color: baseColor }}
              />
            </p>
            <GradientArrow
              className="h-auto w-[60px] md:w-[92px]"
              style={{ color: baseColor }}
            />
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-[1000px] flex-col px-5 pb-[70px] pt-10 md:pb-[120px] md:pt-[100px] lg:px-0">
        <div className="flex w-full flex-col gap-y-3 md:gap-y-6">
          <div className="mx-auto flex w-fit flex-col px-5 md:px-24">
            <div className="flex w-full flex-col gap-3 rounded-[10px] bg-neutral-90 p-5 text-xxsmall12 font-medium text-neutral-40 md:w-fit md:max-w-full md:flex-row md:items-stretch md:px-14 md:py-7">
              <div className="flex shrink-0 items-center gap-x-4 md:min-h-full md:gap-x-8">
                <div className="flex flex-col items-center justify-center md:h-full">
                  <Profile className="h-9 w-9" />
                  <span>{example.name}</span>
                </div>
                <div className="flex flex-col md:h-full md:justify-center md:gap-y-2">
                  <span>희망 직무</span>
                  <span className="text-xsmall14 font-semibold text-neutral-0">
                    {example.hopeJob}
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:min-h-full md:justify-center md:gap-y-2">
                <span>{convertReportTypeToDisplayName(type)} 작성 고민</span>
                <p className="text-xsmall14 font-semibold text-neutral-0">
                  {example.problem}
                </p>
              </div>
            </div>
            <div className="mx-[60px]">
              <BubbleTail />
            </div>
          </div>
          <div className="flex w-full flex-col gap-y-10 md:gap-y-[60px]">
            <div className="flex w-full flex-col items-center gap-x-3 gap-y-2 md:flex-row md:justify-center">
              <div className="h-9 w-9" style={{ backgroundColor: baseColor }} />
              <h5 className="text-medium22 font-bold text-neutral-0 md:text-3xl">
                {example.header}
              </h5>
            </div>
            <div className="relative">
              <div className="w-full overflow-x-hidden">
                <div
                  className="flex w-full items-stretch gap-x-3 overflow-auto scroll-smooth"
                  ref={scrollRef}
                >
                  {reportExample.list.map((example, index) => (
                    <ReportExampleCard
                      key={index}
                      example={example}
                      mainColor={baseColor}
                      subColor={
                        type === 'PERSONAL_STATEMENT'
                          ? personalStatementColors.F9EEFF
                          : resumeColors.E8FDF2
                      }
                    />
                  ))}
                </div>
              </div>
              <PrevButton
                className="absolute left-0 top-1/2 z-10 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer md:block"
                style={{ color: baseColor }}
                onClick={() => handleScroll('left')}
              />
              <NextButton
                className="absolute right-0 top-1/2 hidden h-16 w-16 -translate-y-1/2 translate-x-1/2 transform cursor-pointer md:block"
                style={{ color: baseColor }}
                onClick={() => handleScroll('right')}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportExampleSection;
