'use client';

import { ReportDetail, reportPriceDetailQueryOptions } from '@/api/report';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import { resumeColors } from '@/domain/report/reportColors';
import PromoSection from '@/domain/report/sections/PromoSection';
import ReportApplyBottomSheet from '@/domain/report/modal/ReportApplyBottomSheet';
import ReportBasicInfo from '@/domain/report/ui/ReportBasicInfo';
import ReportExampleSection from '@/domain/report/sections/ReportExampleSection';
import ReportFaqSection from '@/domain/report/sections/ReportFaqSection';
import ReportIntroSection from '@/domain/report/sections/ReportIntroSection';
import ReportPlanSection from '@/domain/report/sections/ReportPlanSection';
import ReportProgramRecommendSlider from '@/domain/report/ui/ReportProgramRecommendSlider';
import ReportReviewSection from '@/domain/report/sections/ReportReviewSection';
import ServiceProcessSection from '@/domain/report/sections/ServiceProcessSection';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { ReportContent } from '@/types/interface';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import ReportNavigation from '@/domain/report/ui/ReportNavigation';

const ReportResumePage = ({ report }: { report: ReportDetail | null }) => {
  const resumeContent: ReportContent = JSON.parse(report?.contents ?? '{}');

  const { initReportApplication } = useReportApplicationStore();

  useEffect(() => {
    initReportApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col bg-black pb-10 text-white md:pb-[60px]">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col px-5 lg:px-0">
          <div className="h-[56px] md:h-[66px]" />
          <ReportBasicInfo reportBasic={report} color={resumeColors._2CE282} />
        </div>
      </div>

      {report?.reportId ? (
        <AsyncBoundary
          pendingFallback={
            <ReportNavigation
              color={resumeColors._2CE282}
              isDark
              isReady={false}
            />
          }
        >
          <ReportResumeBody report={report} content={resumeContent} />
        </AsyncBoundary>
      ) : (
        <ReportNavigation color={resumeColors._2CE282} isDark isReady={false} />
      )}
    </div>
  );
};

function ReportResumeBody({
  report,
  content,
}: {
  report: ReportDetail;
  content: ReportContent;
}) {
  const { data: priceDetail } = useSuspenseQuery(
    reportPriceDetailQueryOptions(report.reportId),
  );

  return (
    <>
      <ReportNavigation color={resumeColors._2CE282} isDark isReady />

      <div
        id="content"
        data-page-type="resume"
        className="flex w-full flex-col items-center"
      >
        {/* 서비스 소개 */}
        <ReportIntroSection type="RESUME" />
        {/* 리포트 예시 */}
        <ReportExampleSection
          type="RESUME"
          reportExample={content.reportExample}
        />
        {/* 후기 */}
        <ReportReviewSection type="RESUME" reportReview={content.review} />
        {/* 가격 및 플랜 */}
        <ReportPlanSection priceDetail={priceDetail} reportType="RESUME" />
        {/* 홍보 배너  */}
        <PromoSection reportType="RESUME" />
        {/* 서비스 이용 안내 */}
        <ServiceProcessSection reportType="RESUME" />
        {/* FAQ  */}
        <ReportFaqSection reportType="RESUME" reportId={report.reportId} />
        {/* 프로그램 추천 */}
        {content.reportProgramRecommend && (
          <ReportProgramRecommendSlider
            reportType="RESUME"
            reportProgramRecommend={content.reportProgramRecommend}
          />
        )}
      </div>

      <ReportApplyBottomSheet report={report} priceDetail={priceDetail} />
    </>
  );
}

export default ReportResumePage;
