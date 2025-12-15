'use client';

import { ReportDetail, useGetReportPriceDetail } from '@/api/report';
import PromoSection from '@/common/report/PromoSection';
import ReportApplyBottomSheet from '@/common/report/ReportApplyBottomSheet';
import ReportBasicInfo from '@/common/report/ReportBasicInfo';
import ReportExampleSection from '@/common/report/ReportExampleSection';
import ReportFaqSection from '@/common/report/ReportFaqSection';
import ReportIntroSection from '@/common/report/ReportIntroSection';
import ReportPlanSection from '@/common/report/ReportPlanSection';
import ReportProgramRecommendSlider from '@/common/report/ReportProgramRecommendSlider';
import ReportReviewSection from '@/common/report/ReportReviewSection';
import ServiceProcessSection from '@/common/report/ServiceProcessSection';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { ReportContent } from '@/types/interface';
import { useEffect } from 'react';
import ReportNavigation from './ReportNavigation';

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

  const { data: priceDetail, isLoading: priceIsLoading } =
    useGetReportPriceDetail(report?.reportId);

  useEffect(() => {
    initReportApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
        <ReportNavigation
          color={personalStatementColors.CA60FF}
          isDark
          isReady={!priceIsLoading}
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
            reportExample={personalStatementContent.reportExample}
          />
          {/* 후기 */}
          <ReportReviewSection
            type="PERSONAL_STATEMENT"
            reportReview={personalStatementContent.review}
          />

          {/* 가격 및 플랜 */}
          {priceDetail && report?.reportType && (
            <ReportPlanSection
              priceDetail={priceDetail}
              reportType="PERSONAL_STATEMENT"
            />
          )}

          {/* 홍보 배너  */}
          {report?.reportType && (
            <PromoSection reportType="PERSONAL_STATEMENT" />
          )}

          {/* 서비스 이용 안내 */}
          {report?.reportType && (
            <ServiceProcessSection reportType="PERSONAL_STATEMENT" />
          )}

          {/* FAQ  */}
          {report?.reportId && (
            <ReportFaqSection
              reportId={report?.reportId}
              reportType="PERSONAL_STATEMENT"
            />
          )}

          {/* 프로그램 추천 */}
          {personalStatementContent.reportProgramRecommend && (
            <ReportProgramRecommendSlider
              reportType="PERSONAL_STATEMENT"
              reportProgramRecommend={
                personalStatementContent.reportProgramRecommend
              }
            />
          )}
        </div>
      </div>

      {report && priceDetail && (
        <ReportApplyBottomSheet report={report} priceDetail={priceDetail} />
      )}
    </>
  );
};

export default ReportPersonalStatementPage;
