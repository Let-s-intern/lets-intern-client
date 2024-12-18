import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import BubbleTail from '@/assets/icons/bubble-tail.svg?react';
import Profile from '@/assets/icons/profile.svg?react';
import { REPORT_EXAMPLE } from '@/data/reportConstant';
import { ReportColors } from '@/types/interface';

interface ReportExampleSectionProps {
  colors: ReportColors;
  type: ReportType;
}

const ReportExampleSection = ({ colors, type }: ReportExampleSectionProps) => {
  const example = REPORT_EXAMPLE[type];
  return (
    <section className="flex w-full max-w-[1000px] flex-col px-5 pb-[70px] pt-10 md:pb-[120px] md:pt-[100px] lg:px-0">
      <h5 className="w-full text-center text-xsmall14 font-semibold text-neutral-45">
        리포트 예시
      </h5>
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
    </section>
  );
};

export default ReportExampleSection;
