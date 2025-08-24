'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { useGetActiveReports, useGetReportPriceDetail } from '@/api/report';
import ReportApplyBottomSheet from '@/components/common/report/ReportApplyBottomSheet';
import { useServerActiveReports } from '@/context/ActiveReports';
import { personalStatementReportDescription } from '@/data/description';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { ReportContent } from '@/types/interface';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import PromoSection from '@components/common/report/PromoSection';
import ReportBasicInfo from '@components/common/report/ReportBasicInfo';
import ReportExampleSection from '@components/common/report/ReportExampleSection';
import ReportFaqSection from '@components/common/report/ReportFaqSection';
import ReportIntroSection from '@components/common/report/ReportIntroSection';
import ReportPlanSection from '@components/common/report/ReportPlanSection';
import ReportProgramRecommendSlider from '@components/common/report/ReportProgramRecommendSlider';
import ReportReviewSection from '@components/common/report/ReportReviewSection';
import ServiceProcessSection from '@components/common/report/ServiceProcessSection';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import ReportNavigation from '@components/page/ReportNavigation';

export const personalStatementColors = {
  C34AFF: '#C34AFF',
  F9EEFF: '#F9EEFF',
  CA60FF: '#CA60FF',
  EB6CFF: '#EB6CFF',
  F3A2FF: '#F3A2FF',
  FCE9FF: '#FCE9FF',
};

const ReportPersonalStatementPage = () => {
  const params = useParams<{ reportId?: string[] }>();
  const reportId = params.reportId?.[0];
  const { data, isLoading } = useGetActiveReports();

  const { initReportApplication } = useReportApplicationStore();

  const activeReportsFromServer = useServerActiveReports();

  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/personal-statement${reportId ? `/${reportId}` : ''}`;
  const description = personalStatementReportDescription;
  const activeReports = data || activeReportsFromServer;
  const visibleReports = activeReports.personalStatementInfoList.filter(
    (item) =>
      item.isVisible === true &&
      item.visibleDate &&
      new Date(item.visibleDate) <= new Date(),
  );
  const report =
    reportId === undefined || isNaN(Number(reportId))
      ? visibleReports.length > 0
        ? visibleReports[0]
        : undefined
      : activeReports.personalStatementInfoList.find(
          (item) => item.reportId === Number(reportId),
        );

  const title = getReportLandingTitle(report?.title ?? '자기소개서');
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
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={url} />
        {description ? <meta name="description" content={description} /> : null}
        <meta
          name="keywords"
          content="렛츠커리어, 렛츠인턴, 챌린지, 인턴, 신입, 취업, 취업준비, 취뽀, 인턴합격, 신입합격, 서류합격, 면접합격, 서류 첨삭, 서류 피드백, 이력서, 자기소개서, 포트폴리오, 이력서 첨삭, 자기소개서 첨삭, 포트폴리오 첨삭, 이력서 피드백, 자기소개서 피드백, 포트폴리오 피드백"
        />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={url} />

        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:url" content={url} />
        {description ? (
          <meta name="twitter:description" content={description} />
        ) : null}
      </Helmet>
      {isLoading ? (
        <LoadingContainer />
      ) : (
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
            isReady={!isLoading && !priceIsLoading}
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
      )}

      {report && priceDetail && (
        <ReportApplyBottomSheet report={report} priceDetail={priceDetail} />
      )}
    </>
  );
};

export default ReportPersonalStatementPage;
