import { convertReportTypeToShortName, ReportType } from '@/api/report';
import NextButton from '@/assets/icons/next-button.svg?react';
import PrevButton from '@/assets/icons/prev-button.svg?react';
import { REPORT_EXAMPLE } from '@/data/reportConstant';
import { REPORT_EXAMPLE_ID } from '@/pages/common/report/ReportNavigation';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
import { ReportExample } from '@/types/interface';
import { useRef, useState } from 'react';
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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [clickedExample, setClickedExample] = useState<number | null>(null);

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

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;

    if (!container || !itemRefs.current.length) return;

    const containerWidth = container.offsetWidth;
    const currentScrollLeft = container.scrollLeft;

    // 한 아이템의 너비를 기준으로 스크롤 이동
    const itemWidth = itemRefs.current[0]?.offsetWidth || 0;
    const gap = 12; // 아이템 간 간격이 있다면 추가
    const scrollAmount = itemWidth + gap;

    const targetScrollLeft =
      direction === 'left'
        ? Math.max(currentScrollLeft - scrollAmount, 0)
        : Math.min(
            currentScrollLeft + scrollAmount,
            container.scrollWidth - containerWidth,
          );

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
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
              className="snap-align-start flex w-full snap-x snap-mandatory items-stretch gap-x-3 overflow-auto scroll-smooth md:overflow-hidden"
              ref={scrollRef}
            >
              {example.map((example, index) => (
                <div
                  key={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className="flex w-[90%] shrink-0 cursor-pointer snap-start flex-col md:w-[calc(50%-6px)]"
                  onClick={() => setClickedExample(index)}
                >
                  <ReportExampleCard example={example} />
                </div>
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
