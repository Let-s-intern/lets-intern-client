import { convertReportTypeToShortName, ReportType } from '@/api/report';
import NextButton from '@/assets/icons/next-button.svg?react';
import PrevButton from '@/assets/icons/prev-button.svg?react';
import { REPORT_EXAMPLE } from '@/data/reportConstant';
import { REPORT_EXAMPLE_ID } from '@/pages/common/report/ReportNavigation';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
import { ReportExample } from '@/types/interface';
import { useRef } from 'react';
import ReportExampleCard from './ReportExampleCard';

interface ReportExampleSectionProps {
  type: ReportType;
  reportExample?: ReportExample | null;
}

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
  const infoBoxStyle = {
    backgroundColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.CA60FF
        : resumeColors._2CE282,
    color: type === 'PERSONAL_STATEMENT' ? 'FFFFFF' : '000000',
  };
  const textDecorationStyle = {
    textDecorationColor:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };
  const backgroundStyle = {
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
      className="w-full"
      style={backgroundStyle}
    >
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-y-3 px-5 pb-[70px] pt-[50px] md:gap-y-5 md:pb-[120px] md:pt-[100px] lg:px-0">
        <div className="flex w-full flex-col gap-y-[30px] md:gap-y-[50px]">
          <div className="flex w-full flex-col gap-y-6 md:gap-y-[50px]">
            <h5 className="w-full text-center text-xsmall14 font-semibold text-neutral-45 md:text-small18">
              리포트 예시
            </h5>
            <div className="flex w-full flex-col items-center gap-y-2">
              <span
                className="break-keep text-center text-xsmall16 font-bold md:text-small20"
                style={subHeaderStyle}
              >
                진단 후 전송해드리는 피드백 리포트
              </span>
              <p className="underline-thickness-2 break-keep text-center text-medium22 font-bold text-neutral-0 md:text-xlarge30">
                {`${convertReportTypeToShortName(type)}의 `}
                <span
                  className="underline decoration-wavy underline-offset-4"
                  style={textDecorationStyle}
                >
                  강점과 약점
                </span>{' '}
                분석은 물론,
                <br />
                명확한{' '}
                <span
                  className="underline decoration-wavy underline-offset-4"
                  style={textDecorationStyle}
                >
                  수정 방향
                </span>
                까지 제시하여 전달드려요.
              </p>
            </div>
          </div>
          <div
            className="mx-auto flex w-full flex-col items-center gap-y-1 rounded-xs px-4 py-2 text-center text-xxsmall12 font-semibold md:w-[540px] md:py-3 md:text-xsmall14"
            style={infoBoxStyle}
          >
            {`${convertReportTypeToShortName(type)} 진단 후, 평가 내용을 전달 받는 리포트 예시 입니다.`}
            <span className="font-normal text-neutral-30">
              *리포트를 클릭하여 더 자세히 살펴보세요!
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="w-full overflow-x-hidden">
            <div
              className="flex w-full items-stretch gap-x-3 overflow-auto scroll-smooth md:overflow-hidden"
              ref={scrollRef}
            >
              {example.map((example, index) => (
                <ReportExampleCard key={index} example={example} />
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
    </section>
  );
};

export default ReportExampleSection;
