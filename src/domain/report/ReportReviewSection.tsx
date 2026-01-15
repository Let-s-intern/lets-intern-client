import { convertReportTypeToDisplayName, ReportType } from '@/api/report';
import { REPORT_REVIEW_ID } from '@/domain/report/ReportNavigation';
import { personalStatementColors } from '@/domain/report/ReportPersonalStatementPage';
import { resumeColors } from '@/domain/report/ReportResumePage';
import { ReportReview } from '@/types/interface';
import { useMediaQuery } from '@mui/material';
import MoreReviewButton from '../../common/review/MoreReviewButton';
import ReportInterviewCard from './ReportInterviewCard';

interface ReportReviewSectionProps {
  type: ReportType;
  reportReview?: ReportReview;
}

const ReportReviewSection = ({
  type,
  reportReview,
}: ReportReviewSectionProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const subHeaderStyle = {
    color:
      type === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
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
    <section
      id={REPORT_REVIEW_ID}
      data-section="review"
      className="flex w-full flex-col bg-black"
    >
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-y-10 px-5 py-[60px] md:gap-y-20 md:pb-[150px] md:pt-[120px] lg:px-0">
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
              실제 사용자와의 인터뷰를 통해 <br />
              확인한 리얼 피드백
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col text-white">
          {reportReview && reportReview.list.length > 0 && (
            <>
              <div className="w-full overflow-x-hidden">
                <div className="flex w-full auto-rows-fr items-stretch gap-x-3 gap-y-5 overflow-x-auto scroll-smooth md:grid md:w-full md:auto-rows-fr md:grid-cols-[1fr_1fr] md:grid-rows-none">
                  {reportReview.list.map((item, index) => (
                    <ReportInterviewCard
                      key={`report-interview-${index}`}
                      interview={item}
                      mainColor={
                        isDesktop
                          ? index % 4 === 1 || index % 4 === 2
                            ? mainColor[1]
                            : mainColor[0]
                          : index % 2 === 0
                            ? mainColor[0]
                            : mainColor[1]
                      }
                      subColor={
                        isDesktop
                          ? index % 4 === 1 || index % 4 === 2
                            ? subColor[1]
                            : subColor[0]
                          : index % 2 === 0
                            ? subColor[0]
                            : subColor[1]
                      }
                    />
                  ))}
                </div>
              </div>
              <MoreReviewButton
                mainColor={'#3E4148'}
                subColor={
                  type === 'PERSONAL_STATEMENT'
                    ? personalStatementColors.CA60FF
                    : resumeColors._2CE282
                }
                subTextColor={
                  type === 'PERSONAL_STATEMENT' ? '#FFFFFF' : '#000000'
                }
                type="REPORT"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReportReviewSection;
