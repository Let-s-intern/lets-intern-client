'use client';

import { ReportDetail, reportPriceDetailQueryOptions } from '@/api/report';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
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

export const personalStatementColors = {
  C34AFF: '#C34AFF',
  F9EEFF: '#F9EEFF',
  CA60FF: '#CA60FF',
  EB6CFF: '#EB6CFF',
  F3A2FF: '#F3A2FF',
  FCE9FF: '#FCE9FF',
};

const ReportPersonalStatementPage = ({
  report,
}: {
  report: ReportDetail | null;
}) => {
  const { initReportApplication } = useReportApplicationStore();

  const personalStatementContent: ReportContent = JSON.parse(
    report?.contents ?? '{}',
  );

  useEffect(() => {
    initReportApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-col bg-black pb-10 text-white md:pb-[60px]">
        <div className="mx-auto flex w-full max-w-[1000px] flex-col px-5 lg:px-0">
          <div className="h-[56px] md:h-[66px]" />
          <ReportBasicInfo
            reportBasic={report}
            color={personalStatementColors.CA60FF}
          />
        </div>
      </div>

      {report?.reportId ? (
        <AsyncBoundary
          pendingFallback={
            <ReportNavigation
              color={personalStatementColors.CA60FF}
              isDark
              isReady={false}
            />
          }
        >
          <ReportPersonalStatementBody
            report={report}
            content={personalStatementContent}
          />
        </AsyncBoundary>
      ) : (
        <ReportNavigation
          color={personalStatementColors.CA60FF}
          isDark
          isReady={false}
        />
      )}
    </div>
  );
};

function ReportPersonalStatementBody({
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
      <ReportNavigation
        color={personalStatementColors.CA60FF}
        isDark
        isReady
      />
      <div
        id="content"
        data-page-type="personal-statement"
        className="flex w-full flex-col items-center"
      >
        {/* 서비스 소개 */}
        <ReportIntroSection type="PERSONAL_STATEMENT" />
        {/* 리포트 예시 */}
        <ReportExampleSection
          type="PERSONAL_STATEMENT"
          reportExample={content.reportExample}
        />
        {/* 후기 */}
        <ReportReviewSection
          type="PERSONAL_STATEMENT"
          reportReview={content.review}
        />

        {/* 가격 및 플랜 */}
        {report.reportType && (
          <ReportPlanSection
            priceDetail={priceDetail}
            reportType="PERSONAL_STATEMENT"
          />
        )}

        {/* 홍보 배너  */}
        {report.reportType && <PromoSection reportType="PERSONAL_STATEMENT" />}

        {/* 서비스 이용 안내 */}
        {report.reportType && (
          <ServiceProcessSection reportType="PERSONAL_STATEMENT" />
        )}

        {/* FAQ  */}
        <ReportFaqSection
          reportId={report.reportId}
          reportType="PERSONAL_STATEMENT"
        />

        {/* 프로그램 추천 */}
        {content.reportProgramRecommend && (
          <ReportProgramRecommendSlider
            reportType="PERSONAL_STATEMENT"
            reportProgramRecommend={content.reportProgramRecommend}
          />
        )}
      </div>

      <ReportApplyBottomSheet report={report} priceDetail={priceDetail} />
    </>
  );
}

export default ReportPersonalStatementPage;
