'use client';

import { useEffect } from 'react';

import { ReportDetail, useGetReportPriceDetail } from '@/api/report';
import ReportApplyBottomSheet from '@/components/common/report/ReportApplyBottomSheet';
import { portfolioReportDescription } from '@/data/description';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { ReportContent } from '@/types/interface';
import { getReportLandingTitle } from '@/utils/url';
import PromoSection from '@components/common/report/PromoSection';
import ReportBasicInfo from '@components/common/report/ReportBasicInfo';
import ReportExampleSection from '@components/common/report/ReportExampleSection';
import ReportFaqSection from '@components/common/report/ReportFaqSection';
import ReportIntroSection from '@components/common/report/ReportIntroSection';
import ReportPlanSection from '@components/common/report/ReportPlanSection';
import ReportProgramRecommendSlider from '@components/common/report/ReportProgramRecommendSlider';
import ReportReviewSection from '@components/common/report/ReportReviewSection';
import ServiceProcessSection from '@components/common/report/ServiceProcessSection';
import ReportNavigation from './ReportNavigation';
import { resumeColors } from './ReportResumePage';

const ReportPortfolioPage = ({ report }: { report: ReportDetail | null }) => {
  const description = portfolioReportDescription;
  const title = getReportLandingTitle(report?.title ?? '포트폴리오');
  const portfolioContent: ReportContent = JSON.parse(report?.contents ?? '{}');

  const { data: priceDetail, isLoading: priceIsLoading } =
    useGetReportPriceDetail(report?.reportId);

  const { initReportApplication } = useReportApplicationStore();

  useEffect(() => {
    initReportApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex w-full flex-col bg-black pb-10 text-white md:pb-[60px]">
          <div className="mx-auto flex w-full max-w-[1000px] flex-col px-5 lg:px-0">
            <div className="h-[56px] md:h-[66px]" />
            <ReportBasicInfo
              reportBasic={report}
              color={resumeColors._2CE282}
            />
          </div>
        </div>
        <ReportNavigation
          color={resumeColors._2CE282}
          isDark
          isReady={!priceIsLoading}
        />
        <div
          id="content"
          data-page-type="portfolio"
          className="flex flex-col items-center w-full"
        >
          {/* 서비스 소개 */}
          <ReportIntroSection type="PORTFOLIO" />
          {/* 리포트 예시 */}
          <ReportExampleSection
            type="PORTFOLIO"
            reportExample={portfolioContent.reportExample}
          />
          {/* 후기 */}
          <ReportReviewSection
            type="PORTFOLIO"
            reportReview={portfolioContent.review}
          />
          {/* 가격 및 플랜 */}
          {priceDetail && report?.reportType && (
            <ReportPlanSection
              priceDetail={priceDetail}
              reportType="PORTFOLIO"
            />
          )}
          {/* 홍보 배너  */}
          {report?.reportType && <PromoSection reportType="PORTFOLIO" />}
          {/* 서비스 이용 안내 */}
          {report?.reportType && (
            <ServiceProcessSection reportType="PORTFOLIO" />
          )}
          {/* FAQ  */}
          {report?.reportId && (
            <ReportFaqSection
              reportType="PORTFOLIO"
              reportId={report?.reportId}
            />
          )}
          {/* 프로그램 추천 */}
          {portfolioContent.reportProgramRecommend && (
            <ReportProgramRecommendSlider
              reportType="PORTFOLIO"
              reportProgramRecommend={portfolioContent.reportProgramRecommend}
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

export default ReportPortfolioPage;
