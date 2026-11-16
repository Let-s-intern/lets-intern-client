import { convertReportTypeToShortName, ReportType } from '@/api/report';
import CloseIcon from '@/assets/icons/close.svg?react';
import NextButton from '@/assets/icons/next-button.svg?react';
import PrevButton from '@/assets/icons/prev-button.svg?react';
import { REPORT_EXAMPLE } from '@/data/reportConstant';
import { REPORT_EXAMPLE_ID } from '@/domain/report/ReportNavigation';
import { personalStatementColors } from '@/domain/report/ReportPersonalStatementPage';
import { resumeColors } from '@/domain/report/ReportResumePage';
import { useControlScroll } from '@/hooks/useControlScroll';
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

  useControlScroll(clickedExample !== null);

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
    color: type === 'PERSONAL_STATEMENT' ? '#FAFAFA' : '#27272D',
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
                진단 후 전송해 드리는 피드백 리포트
              </span>
              <p className="underline-thickness-2 break-keep text-center text-medium22 font-bold text-neutral-0 md:text-xlarge30">
                {`${convertReportTypeToShortName(type)}의 `}
                <span
                  className="underline underline-offset-4"
                  style={textDecorationStyle}
                >
                  강점과 약점
                </span>{' '}
                분석은 물론,
                <br />
                명확한{' '}
                <span
                  className="underline underline-offset-4"
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
            {`${convertReportTypeToShortName(type)} 진단 후, 평가 내용을 전달받는 리포트 예시입니다.`}
            <span
              className={`font-normal ${type === 'PERSONAL_STATEMENT' ? 'text-neutral-80' : 'text-neutral-30'}`}
            >
              *리포트를 클릭하여 더 자세히 살펴보세요!
            </span>
          </div>
        </div>
        <div className="w-full">
          <div className="relative">
            <div className="w-full overflow-x-hidden">
              <div
                className="snap-align-start flex w-full snap-x snap-mandatory items-stretch gap-x-3 overflow-auto scroll-smooth md:overflow-hidden"
                ref={scrollRef}
              >
                {example.map((example, index) => (
                  <div
                    key={index}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    className="flex w-[90%] shrink-0 cursor-pointer snap-start flex-col md:w-[calc(50%-6px)]"
                    onClick={() => setClickedExample(index)}
                  >
                    <ReportExampleCard example={example} />
                  </div>
                ))}
              </div>
            </div>
            <PrevButton
              className="absolute left-2 top-1/2 z-10 hidden h-16 w-16 -translate-y-1/2 transform cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 md:block"
              style={{ color: baseColor }}
              onClick={() => handleScroll('left')}
            />
            <NextButton
              className="absolute right-2 top-1/2 hidden h-16 w-16 -translate-y-1/2 transform cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 md:block"
              style={{ color: baseColor }}
              onClick={() => handleScroll('right')}
            />
          </div>
        </div>
      </div>
      {clickedExample !== null && (
        <div
          className="fixed left-0 top-0 z-50 h-full w-full bg-black bg-opacity-50"
          onClick={() => setClickedExample(null)}
        >
          <div
            className="fixed left-1/2 top-1/2 flex max-h-[90%] w-[90%] max-w-[720px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full flex-col gap-y-2 overflow-y-auto p-4 pb-9 sm:gap-y-3 sm:p-14 sm:pb-16">
              <div className="flex w-full items-center justify-between">
                <div className="flex h-5 w-5 items-center justify-center rounded-xxs bg-primary-light text-xsmall14 font-semibold text-white sm:h-6 sm:w-6 sm:text-xsmall16">
                  {clickedExample + 1}
                </div>
                <CloseIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => setClickedExample(null)}
                />
              </div>
              <div className="w-full text-wrap break-keep text-center text-xxsmall12 font-semibold sm:text-small20">
                {example[clickedExample].title.slice(3)}
              </div>
              <div className="relative mt-2.5 w-full md:mt-2">
                <img
                  src={example[clickedExample].modalSrc}
                  alt={example[clickedExample].title}
                  className="h-auto min-h-52 w-full rounded-xxs bg-neutral-95 sm:min-h-[500px]"
                />
                <PrevButton
                  className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer text-neutral-20 transition-all duration-300 ease-in-out hover:scale-110 sm:h-16 sm:w-16"
                  onClick={() =>
                    setClickedExample(
                      clickedExample > 0 ? clickedExample - 1 : 0,
                    )
                  }
                />
                <NextButton
                  className="absolute right-0 top-1/2 h-8 w-8 -translate-y-1/2 translate-x-1/2 transform cursor-pointer text-neutral-20 transition-all duration-300 ease-in-out hover:scale-110 sm:h-16 sm:w-16"
                  onClick={() =>
                    setClickedExample(
                      clickedExample < example.length - 1
                        ? clickedExample + 1
                        : example.length - 1,
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReportExampleSection;
