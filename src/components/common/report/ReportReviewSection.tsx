import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import { REPORT_INTERVIEW } from '@/data/reportConstant';
import { personalStatementColors } from '@/pages/common/report/ReportPersonalStatementPage';
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
  const subHeaderStyle = {
    color:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._2CE282,
  };
  const mainColor =
    type === 'PERSONAL_STATEMENT'
      ? [personalStatementColors.CA60FF, personalStatementColors.F3A2FF]
      : [resumeColors._14BCFF, resumeColors._2CE282];
  const subColor =
    type === 'PERSONAL_STATEMENT'
      ? [personalStatementColors.F9EEFF, personalStatementColors.FCE9FF]
      : [resumeColors.EEFAFF, resumeColors.E8FDF2];

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
              style={subHeaderStyle}
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
                  mainColor={index % 2 === 0 ? mainColor[0] : mainColor[1]}
                  subColor={index % 2 === 0 ? subColor[0] : subColor[1]}
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
                    mainColor={
                      type === 'PERSONAL_STATEMENT'
                        ? personalStatementColors.C34AFF
                        : resumeColors._2CE282
                    }
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
