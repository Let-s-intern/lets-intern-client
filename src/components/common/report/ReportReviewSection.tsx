import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import { REPORT_INTERVIEW } from '@/data/reportConstant';
import { resumeColors } from '@/pages/common/report/ReportResumePage';
import { ReportReview } from '@/types/interface';
import ReportInterviewCard from './ReportInterviewCard';
import ReportReviewCard from './ReportReviewCard';

interface ReportReviewSectionProps {
  type: ReportType;
  reportReview?: ReportReview;
}

const ReportReviewSection = ({
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
              style={{ color: resumeColors._171918 }}
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
                      ? resumeColors._171918
                      : resumeColors._06B259
                  }
                  subColor={
                    index % 2 === 0
                      ? resumeColors._2CE282
                      : resumeColors._4FDA46
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
                    mainColor={resumeColors._171918}
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
