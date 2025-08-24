'use client';

import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { useGetActiveReports, useGetReportPriceDetail } from '@/api/report';
import ReportApplyBottomSheet from '@/components/common/report/ReportApplyBottomSheet';
import { useServerActiveReports } from '@/context/ActiveReports';
import { resumeReportDescription } from '@/data/description';
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
import { useParams } from 'next/navigation';

export const resumeColors = {
  E8FDF2: '#E8FDF2',
  B1FFD6: '#B1FFD6',
  A5FFCF: '#A5FFCF',
  _4FDA46: '#4FDA46',
  _2CE282: '#2CE282',
  _06B259: '#06B259',
  D8E36C: '#D8E36C',
  F7FFAB: '#F7FFAB',
  _14BCFF: '#14BCFF',
  EEFAFF: '#EEFAFF',
  _2CDDEA: '#2CDDEA',
  _11AC5C: '#11AC5C',
};

const ReportResumePage = () => {
  const params = useParams<{ reportId?: string[] }>();
  const reportId = params.reportId?.[0];
  const activeReportsFromServer = useServerActiveReports();
  const { data, isLoading } = useGetActiveReports();

  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/resume${reportId ? `/${reportId}` : ''}`;
  const description = resumeReportDescription;
  const activeReports = data || activeReportsFromServer;
  const visibleReports = activeReports.resumeInfoList.filter(
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
      : activeReports.resumeInfoList.find(
          (item) => item.reportId === Number(reportId),
        );

  const title = getReportLandingTitle(report?.title ?? '이력서');
  const resumeContent: ReportContent = JSON.parse(report?.contents ?? '{}');

  const { data: priceDetail, isLoading: priceIsLoading } =
    useGetReportPriceDetail(report?.reportId);

  const { initReportApplication } = useReportApplicationStore();

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
                color={resumeColors._2CE282}
              />
            </div>
          </div>

          <ReportNavigation
            color={resumeColors._2CE282}
            isDark
            isReady={!isLoading && !priceIsLoading}
          />

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
              reportExample={resumeContent.reportExample}
            />
            {/* 후기 */}
            <ReportReviewSection
              type="RESUME"
              reportReview={resumeContent.review}
            />
            {/* 가격 및 플랜 */}
            {priceDetail && (
              <ReportPlanSection
                priceDetail={priceDetail}
                reportType="RESUME"
              />
            )}
            {/* 홍보 배너  */}
            <PromoSection reportType="RESUME" />
            {/* 서비스 이용 안내 */}
            <ServiceProcessSection reportType="RESUME" />
            {/* FAQ  */}
            {report?.reportId && (
              <ReportFaqSection
                reportType="RESUME"
                reportId={report?.reportId}
              />
            )}
            {/* 프로그램 추천 */}
            {resumeContent.reportProgramRecommend && (
              <ReportProgramRecommendSlider
                reportType="RESUME"
                reportProgramRecommend={resumeContent.reportProgramRecommend}
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

export default ReportResumePage;
