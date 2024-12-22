import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import { REPORT_INTERVIEW } from '@/data/reportConstant';
import { ReportColors, ReportReview } from '@/types/interface';
import ReportInterviewCard from './ReportInterviewCard';
import ReportReviewCard from './ReportReviewCard';

interface ReportReviewSectionProps {
  colors: ReportColors;
  type: ReportType;
  reportReview?: ReportReview;
}

const ReportReviewSection = ({
  colors,
  type,
  reportReview,
}: ReportReviewSectionProps) => {
  const interview = REPORT_INTERVIEW[type];

  return (
    <div className="flex w-full flex-col bg-black">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-y-10 px-5 py-[60px] md:gap-y-20 md:py-[120px] lg:px-0">
        <div className="flex w-full flex-col gap-y-6 md:gap-y-[50px]">
          <h5 className="w-full text-center text-xsmall14 font-semibold text-neutral-45 md:text-small18">
            후기
          </h5>
          <div className="flex w-full flex-col gap-y-2 whitespace-pre-wrap break-keep">
            <span
              className="w-full text-center text-xsmall16 font-bold md:text-small20"
              style={{ color: colors.primary.DEFAULT }}
            >{`${convertReportTypeToDisplayName(type)} 피드백 REPORT, 실제로 효과 있을까?`}</span>
            <p className="w-full text-center text-medium22 font-bold text-white md:text-xlarge30">
              실제 사용자와의 인터뷰를 통해{' '}
              {/* <br className="hidden md:inline-block" /> */}
              <br />
              확인한 리얼 피드백
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-[50px] text-white md:gap-y-20">
          <div className="mx-auto max-w-full overflow-x-hidden">
            <div className="flex w-full auto-rows-fr items-stretch gap-x-3 gap-y-5 overflow-x-auto scroll-smooth md:grid md:grid-cols-[1fr_1fr]">
              {interview.interviewList.map((item, index) => (
                <ReportInterviewCard
                  key={`report-interview-${index}`}
                  interview={item}
                  mainColor={
                    index % 2 === 0
                      ? colors.primary.DEFAULT
                      : colors.primary[500]
                  }
                  subColor={
                    index % 2 === 0 ? colors.primary[400] : colors.primary[300]
                  }
                />
              ))}
            </div>
          </div>
          {reportReview && reportReview.list.length > 0 && (
            <div className="mx-auto max-w-full overflow-x-hidden">
              <div className="flex w-full gap-x-3 overflow-x-auto scroll-smooth">
                {reportReview.list.map((review, index) => (
                  <ReportReviewCard
                    key={`report-review-${index}`}
                    review={review}
                    mainColor={colors.primary.DEFAULT}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportReviewSection;
