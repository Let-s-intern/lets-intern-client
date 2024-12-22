import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { useGetActiveReports, useGetReportPriceDetail } from '@/api/report';
import ReportApplyBottomSheet from '@/components/common/report/ReportApplyBottomSheet';
import { useServerActiveReports } from '@/context/ActiveReports';
import { resumeReportDescription } from '@/data/description';
import useReportApplicationStore from '@/store/useReportApplicationStore';
import { ReportColors, ReportContent } from '@/types/interface';
import { getBaseUrlFromServer, getReportLandingTitle } from '@/utils/url';
import Header from '@components/common/program/program-detail/header/Header';
import PromoSection from '@components/common/report/PromoSection';
import ReportBasicInfo from '@components/common/report/ReportBasicInfo';
import ReportExampleSection from '@components/common/report/ReportExampleSection';
import ReportFaqSection from '@components/common/report/ReportFaqSection';
import ReportIntroSection from '@components/common/report/ReportIntroSection';
import ReportPlanSection from '@components/common/report/ReportPlanSection';
import ReportProgramRecommendSlider from '@components/common/report/ReportProgramRecommendSlider';
import ReportReviewSection from '@components/common/report/ReportReviewSection';
import ResearchTeamSection from '@components/common/report/ResearchTeamSection';
import ServiceProcessSection from '@components/common/report/ServiceProcessSection';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import ReportNavigation from './ReportNavigation';

export const resumeColors: ReportColors = {
  primary: {
    DEFAULT: '#171918',
    50: '#E8FDF2',
    100: '#B1FFD6',
    200: '#A5FFCF',
    300: '#4FDA46',
    400: '#2CE282',
    500: '#06B259',
  },
  secondary: {
    DEFAULT: '#D8E36C',
    50: '#F7FFAB',
  },
  highlight: {
    DEFAULT: '#14BCFF',
    50: '#EEFAFF',
    100: '#2CDDEA',
  },
};

const ReportResumePage = () => {
  const activeReportsFromServer = useServerActiveReports();
  const { data, isLoading } = useGetActiveReports();
  const title = getReportLandingTitle(data?.resumeInfo?.title ?? '이력서');

  const url = `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}/report/landing/resume`;
  const description = resumeReportDescription;
  const activeReports = data || activeReportsFromServer;
  const report = activeReports?.resumeInfo;
  const resumeContent: ReportContent = JSON.parse(
    data?.resumeInfo?.contents ?? '{}',
  );

  const { data: priceDetail } = useGetReportPriceDetail(report?.reportId);

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
          <div className="flex w-full flex-col bg-black pb-12 text-white md:pb-20">
            <div className="mx-auto flex w-full max-w-[1000px] flex-col px-5 lg:px-0">
              <Header programTitle={'서류완성의 시작과 끝은 진단에서부터'} />
              <ReportBasicInfo reportBasic={data?.resumeInfo} />
            </div>
          </div>
          <ReportNavigation color={resumeColors.primary.DEFAULT} isDark />
          <div className="flex w-full flex-col items-center gap-y-12 md:gap-y-6">
            {/* 서비스 소개 */}
            <ReportIntroSection colors={resumeColors} type="RESUME" />
            {/* 리포트 예시 */}
            <ReportExampleSection
              colors={resumeColors}
              type="RESUME"
              reportExample={resumeContent.reportExample}
            />
            {/* 후기 */}
            <ReportReviewSection
              colors={resumeColors}
              type="RESUME"
              reportReview={resumeContent.review}
            />
            {/* 취업 연구팀 소개 */}
            <ResearchTeamSection colors={resumeColors} />
            {/* 가격 및 플랜 */}
            {priceDetail && report?.reportType && (
              <ReportPlanSection
                colors={resumeColors}
                priceDetail={priceDetail}
                reportType={'RESUME'}
              />
            )}
            {/* 홍보 배너  */}
            {report?.reportType && (
              <PromoSection
                colors={resumeColors}
                reportType={report.reportType}
              />
            )}
            {/* 서비스 이용 안내 */}
            {report?.reportType && (
              <ServiceProcessSection
                colors={resumeColors}
                reportType={report.reportType}
              />
            )}
            {/* FAQ  */}
            {report?.reportId && (
              <ReportFaqSection
                colors={resumeColors}
                reportId={report?.reportId}
              />
            )}
            {/* 프로그램 추천 */}
            {resumeContent.reportProgramRecommend && (
              <ReportProgramRecommendSlider
                colors={resumeColors}
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
